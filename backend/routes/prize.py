from beanie.operators import Set
from fastapi import (
    APIRouter,
    UploadFile,
    HTTPException,
    Response,
    status
)
from pydantic import BaseModel

from asyncio import gather
from typing import Optional

from schemas.prize import Prize, PrizeCreate, PrizeUpdate
from schemas.prize_order import PrizeOrder
from schemas.prize_image import PrizeImage
from snowflake import SnowflakeID

from .auth import AdminDepends, UserDepends


class OnlyUid(BaseModel):
    uid: SnowflakeID


PRIZE_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Prize not found"
)

POINT_NOT_ENOUGH = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Point not enough"
)

PRIZE_NOT_EOUNGH = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Prize not enough"
)

router = APIRouter(
    prefix="/prize",
    tags=["Prize"]
)

with open("default_prize.png", "rb") as default_prize:
    default_image_data = default_prize.read()


@router.get(
    path="",
    response_model=list[Prize],
    status_code=status.HTTP_200_OK
)
async def get_prizes() -> list[Prize]:
    return await Prize.find_all().to_list()


@router.post(
    path="",
    response_model=Prize,
    status_code=status.HTTP_201_CREATED,
    dependencies=[AdminDepends]
)
async def create_prize(data: PrizeCreate) -> Prize:
    prize = Prize(**data.model_dump())
    await prize.save()

    return prize


@router.put(
    path="/{prize_id}",
    response_model=Prize,
    status_code=status.HTTP_200_OK,
    dependencies=[AdminDepends]
)
async def update_prize(prize_id: str, data: PrizeUpdate) -> Prize:
    prize = await Prize.find_one(Prize.uid == prize_id)
    if prize is None:
        raise PRIZE_NOT_FOUND

    prize = await prize.update(Set(data.model_dump(exclude_none=True)))

    return prize


@router.post(
    path="/{prize_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[AdminDepends]
)
async def update_prize_image(prize_id: str, file: UploadFile) -> None:
    data = await file.read()
    prize_image = PrizeImage(
        prize_id=SnowflakeID(prize_id),
        content_type=file.content_type or "",
        data=data
    )
    await prize_image.save()


@router.get(
    path="/count",
    status_code=status.HTTP_200_OK,
)
async def get_prize_count() -> dict[SnowflakeID, int]:
    prize_uids = await Prize.find().project(OnlyUid).to_list()

    count_list = await gather(*[
        PrizeOrder.find(PrizeOrder.prize_id == prize.uid).count()
        for prize in prize_uids
    ])

    return {
        prize.uid: count
        for prize, count in zip(prize_uids, count_list)
    }


@router.get(
    path="/{prize_id}/image",
    status_code=status.HTTP_200_OK,
)
async def get_prize_image(prize_id: str) -> Response:
    image = await PrizeImage.find_one(PrizeImage.prize_id == prize_id)
    if image is None:
        return Response(default_avatar_data, media_type="image/png")

    return Response(image.data, media_type=image.content_type)


@router.get(
    path="/{prize_id}/order",
    status_code=status.HTTP_201_CREATED,
)
async def get_prize(prize_id: str, user: UserDepends) -> None:
    prize = await Prize.find_one(Prize.uid == prize_id)
    if prize is None:
        raise PRIZE_NOT_FOUND

    order_count = await PrizeOrder.find(PrizeOrder.prize_id == prize.uid).count()
    if order_count >= prize.total_count:
        raise PRIZE_NOT_EOUNGH

    if user.score < prize.cost:
        raise POINT_NOT_ENOUGH

    user.score -= prize.cost
    order = PrizeOrder(
        user_id=user.uid,
        prize_id=prize.uid
    )

    await user.save()
    await order.save()
