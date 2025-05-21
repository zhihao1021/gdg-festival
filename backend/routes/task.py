from beanie.operators import Set
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from asyncio import gather, create_task as async_create_task
from datetime import datetime

from schemas.user import User
from schemas.task import Task, TaskCreate, TaskUpdate, TaskView
from schemas.record import Record
from snowflake import SnowflakeID

from .auth import AdminDepends, IsAdminDepends, UserDepends


class OnlyReleaseTime(BaseModel):
    release_date: datetime


class OnlyUid(BaseModel):
    uid: SnowflakeID


TASK_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Task not found"
)
TASK_FULL = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Task is full"
)
NOT_ACQUIRE = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="You have not acquired this task"
)
ALREADY_ACQUIRED = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Already acquired this task"
)
ALREADY_FINISHED = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Already finished this task"
)

router = APIRouter(
    prefix="/task",
    tags=["Task"]
)


@router.get(
    path="",
    response_model=list[TaskView],
    status_code=status.HTTP_200_OK
)
async def get_task_list() -> list[TaskView]:
    return await Task.find(
        Task.display == True,
        Task.release_date <= datetime.now(),
        projection_model=TaskView,
    ).to_list()


@router.get(
    path="/all",
    response_model=list[TaskView],
    status_code=status.HTTP_200_OK,
    dependencies=[AdminDepends],
)
async def get_all_task_list() -> list[TaskView]:
    return await Task.find(
        projection_model=TaskView,
    ).to_list()


@router.post(
    path="",
    response_model=TaskView,
    status_code=status.HTTP_201_CREATED,
    dependencies=[AdminDepends],
)
async def create_task(data: TaskCreate) -> TaskView:
    task = Task(**data.model_dump())
    task = await task.save()
    return TaskView(**task.model_dump())


@router.get(
    path="/count",
    status_code=status.HTTP_200_OK
)
async def get_task_acquired_count() -> dict[SnowflakeID, int]:
    task_uids = await Task.find().project(OnlyUid).to_list()
    count_list = await gather(*[
        Record.find(Record.task_id == task.uid).count()
        for task in task_uids
    ])

    return {
        task.uid: count
        for task, count in zip(task_uids, count_list)
    }


@router.get(
    path="/{task_id}",
    response_model=TaskView,
    status_code=status.HTTP_200_OK,
)
async def get_task(
    task_id: str,
    is_admin: IsAdminDepends,
) -> TaskView:
    query = [Task.uid == task_id]
    if not is_admin:
        query.append(Task.display == True)

    task = await Task.find_one(*query, fetch_links=True)
    if task is None:
        raise TASK_NOT_FOUND

    return TaskView(**task.model_dump())


@router.put(
    path="/{task_id}",
    response_model=TaskView,
    status_code=status.HTTP_201_CREATED,
    dependencies=[AdminDepends],
)
async def update_task(
    task_id: str,
    data: TaskUpdate
) -> TaskView:
    task = await Task.find_one(Task.uid == task_id)
    if task is None:
        raise TASK_NOT_FOUND

    original_poionts = task.points
    task = await task.update(Set(data.model_dump(exclude_none=True)))
    if task.points != original_poionts:
        records = await Record.find(Record.task_id == task.uid, Record.status == "finished").to_list()

        async def update_user_score(uid: SnowflakeID):
            await User.find_one(User.uid == uid).inc({User.score: task.points - original_poionts})

        await gather(*[
            async_create_task(update_user_score(record.user_id))
            for record in records
        ])

    return TaskView(**task.model_dump())


@router.delete(
    path="/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[AdminDepends],
)
async def delete_task(
    task_id: str
) -> None:
    await Task.find_one(Task.uid == task_id).delete()


@router.get(
    path="/{task_id}/acquire",
    status_code=status.HTTP_200_OK
)
async def acquire_task(
    task_id: str,
    user: UserDepends
) -> None:
    task = await Task.find_one(Task.uid == task_id)
    if task is None:
        raise TASK_NOT_FOUND

    acquired_count = await Record.find(Record.task_id == task.uid).count()
    if acquired_count >= task.total_count:
        raise TASK_FULL

    record_exist = await Record.find_one(Record.task_id == task.uid, Record.user_id == user.uid).exists()
    if record_exist:
        raise ALREADY_ACQUIRED

    record = Record(task_id=task.uid, user_id=user.uid, status="acquired")
    await record.save()


@router.get(
    path="/{task_id}/finish",
    status_code=status.HTTP_200_OK
)
async def finish_task(
    task_id: str,
    user: UserDepends
) -> None:
    task_exist = await Task.find_one(Task.uid == task_id).exists()
    if not task_exist:
        raise TASK_NOT_FOUND

    record = await Record.find_one(Record.task_id == task_id, Record.user_id == user.uid)
    if record is None:
        raise NOT_ACQUIRE

    if record.status != "acquired":
        raise ALREADY_FINISHED

    record.status = "pending"
    await record.save()


@router.get(
    path="/{task_id}/drop",
    status_code=status.HTTP_200_OK
)
async def drop_task(
    task_id: str,
    user: UserDepends
) -> None:
    task_exist = await Task.find_one(Task.uid == task_id).exists()
    if not task_exist:
        raise TASK_NOT_FOUND

    record = await Record.find_one(Record.task_id == task_id, Record.user_id == user.uid)
    if record is None:
        raise NOT_ACQUIRE

    if record.status != "acquired":
        raise ALREADY_FINISHED

    await record.delete()
