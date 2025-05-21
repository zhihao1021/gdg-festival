from beanie.operators import Set
from fastapi import APIRouter, HTTPException, status, UploadFile
from fastapi.responses import Response
from PIL import Image

from io import BytesIO

from schemas.user import DEPARTMENT_TYPE, GlobalUserView, User, UserUpdate, UserView
from schemas.avatar import Avatar

from .auth import UserDepends, UIDDepends

FILE_TOO_LARGE = HTTPException(
    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
    detail="File size exceeds 5MB limit"
)
NO_FILE_SIZE = HTTPException(
    status_code=status.HTTP_411_LENGTH_REQUIRED,
    detail="File size is required"
)
UNSUPPORTED_MEDIA_TYPE = HTTPException(
    status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
    detail="Unsupported media type"
)

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

with open("default_avatar.png", "rb") as default_avatar:
    default_avatar_data = default_avatar.read()


@router.get(
    path="",
    response_model=UserView,
    status_code=status.HTTP_200_OK
)
async def get_self_data(user: UserDepends) -> UserView:
    return UserView(**user.model_dump())


@router.put(
    path="",
    response_model=UserView,
    status_code=status.HTTP_201_CREATED
)
async def update_self_data(user: UserDepends, data: UserUpdate) -> UserView:
    excludes = ["original_password"]
    if data.original_password is None or data.password is None:
        excludes.append("password")
    elif not user.check_password(data.original_password):
        excludes.append("password")

    update_data = data.model_dump(exclude_none=True, exclude=set(excludes))

    if data.password is not None:
        if data.original_password is None:
            del update_data["password"]
        elif user.check_password(data.original_password):
            del update_data["original"]

    user = await user.update(Set(data.model_dump(exclude_none=True)))

    return UserView(**user.model_dump())


@router.get(
    path="/avatar",
    status_code=status.HTTP_200_OK,
)
async def get_avatar(uid: UIDDepends) -> Response:
    avatar = await Avatar.find_one(Avatar.uid == uid)
    if avatar is None:
        return Response(default_avatar_data, media_type="image/png")

    return Response(avatar.data, media_type=avatar.content_type)


@router.put(
    path="/avatar",
    status_code=status.HTTP_201_CREATED,
)
async def update_avatar(uid: UIDDepends, file: UploadFile) -> None:
    size = file.size
    if size is None:
        raise NO_FILE_SIZE
    if size > 1024 * 1024 * 5:
        raise FILE_TOO_LARGE

    data = await file.read()
    try:
        with Image.open(BytesIO(data)) as img:
            img.verify()
            content_type = file.content_type or (img.format or "").lower()
    except:
        raise UNSUPPORTED_MEDIA_TYPE

    avatar = Avatar(
        uid=uid,
        data=data,
        content_type=content_type,
    )
    await avatar.save()


@router.delete(
    path="/avatar",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_avatar(uid: UIDDepends) -> None:
    await Avatar.find_one(Avatar.uid == uid).delete()


@router.get(
    path="/avatar/{uid}",
    status_code=status.HTTP_200_OK,
)
async def get_avatar_by_uid(uid: str,) -> Response:
    avatar = await Avatar.find_one(Avatar.uid == uid)
    if avatar is None:
        return Response(default_avatar_data, media_type="image/png")

    return Response(avatar.data, media_type=avatar.content_type)


@router.get(
    path="/count",
    status_code=status.HTTP_200_OK,
)
async def get_user_count() -> int:
    count = await User.count()
    return count


@router.get(
    path="/rank/all",
    status_code=status.HTTP_200_OK,
)
async def get_all_user_rank() -> list[GlobalUserView]:
    users = await User.find_all().sort(-User.score).project(GlobalUserView).to_list()  # type: ignore
    return users


@router.get(
    path="/rank/department/{department}",
    status_code=status.HTTP_200_OK,
)
async def get_department_user_rank(department: DEPARTMENT_TYPE) -> list[GlobalUserView]:
    users = await User.find(User.department == department).sort(-User.score).project(GlobalUserView).to_list() # type: ignore
    return users


@router.get(
    path="/rank/department/{department}/{department_level}",
    status_code=status.HTTP_200_OK,
)
async def get_department_level_user_rank(department: DEPARTMENT_TYPE, department_level: int) -> list[GlobalUserView]:
    users = await User.find(User.department == department, User.department_level == department_level).sort(-User.score).project(GlobalUserView).to_list() # type: ignore
    return users
