from beanie.operators import Set
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from datetime import datetime

from schemas.user import User, UserView
from schemas.task import Task
from schemas.record import Record, RecordView

from .auth import UserDepends, AdminDepends


class OnlyScore(BaseModel):
    points: int


class RecordWithUserView(RecordView):
    user: UserView


RECORD_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Record not found"
)

router = APIRouter(
    prefix="/record",
    tags=["Record"]
)


@router.get(
    path="",
    response_model=list[RecordView]
)
async def get_record_list(
    user: UserDepends,
) -> list[RecordView]:
    await Record.find(Record.time_limit < datetime.now(), Record.status == "acquired").delete()

    return await Record.find(
        Record.user_id == user.uid,
        projection_model=RecordView
    ).to_list()


@router.get(
    path="/pending",
    response_model=list[RecordWithUserView],
    dependencies=[AdminDepends]
)
async def get_pending_record_list() -> list[RecordWithUserView]:
    await Record.find(Record.time_limit < datetime.now(), Record.status == "acquired").delete()

    return await Record.find(Record.status == "pending").aggregate([
        {
            "$lookup": {
                "from": "Users",
                "localField": "user_id",
                "foreignField": "uid",
                "as": "user"
            }
        },
        {
            "$unwind": "$user"
        }
    ], projection_model=RecordWithUserView).to_list()


@router.post(
    path="/{record_id}/accept",
    response_model=RecordView,
    status_code=200,
    dependencies=[AdminDepends]
)
async def update_record(
    record_id: str,
) -> RecordView:
    record = await Record.find_one(Record.uid == record_id)
    if record is None:
        raise RECORD_NOT_FOUND

    task = await Task.find_one(Task.uid == record.task_id, projection_model=OnlyScore)
    if task is None:
        raise RECORD_NOT_FOUND
    await User.find_one(User.uid == record.user_id).inc({User.score: task.points})

    record = await record.update(Set({Record.status: "finished"}))
    return RecordView(**record.model_dump())
