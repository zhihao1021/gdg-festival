from beanie.operators import Set
from fastapi import APIRouter, Body, HTTPException, status
from jwt import encode, decode

from datetime import datetime, timedelta
from typing import Annotated
try:
    from datetime import UTC
except ImportError:
    from datetime import timezone
    UTC = timezone.utc

from config import JWT_KEY
from schemas.prize_order import PrizeOrder, PrizeOrderView
from schemas.user import UserView

from .auth import AdminDepends, UIDDepends


class PrizeOrderWithUser(PrizeOrder):
    user: UserView


ORDER_NOT_FOUND = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Order not found"
)
INVALID_CODE = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="Invalid code"
)

router = APIRouter(
    prefix="/order",
    tags=["Order"]
)


@router.get(
    path="",
    response_model=list[PrizeOrderView],
    status_code=status.HTTP_200_OK,
)
async def get_my_orders(user_id: UIDDepends) -> list[PrizeOrderView]:
    return await PrizeOrder.find(
        PrizeOrder.user_id == user_id,
        projection_model=PrizeOrderView
    ).to_list()


@router.get(
    path="/all",
    response_model=list[PrizeOrderWithUser],
    status_code=status.HTTP_200_OK,
    dependencies=[AdminDepends]
)
async def get_all_orders() -> list[PrizeOrderWithUser]:
    return await PrizeOrder.find().aggregate([
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
    ], projection_model=PrizeOrderWithUser).to_list()


@router.post(
    path="/verify",
    response_model=PrizeOrderView,
    status_code=status.HTTP_200_OK,
    dependencies=[AdminDepends]
)
async def verify_order(
    code: Annotated[str, Body(embed=True)]
) -> PrizeOrderView:
    try:
        data = decode(
            code,
            key=JWT_KEY,
            algorithms=["HS256"],
            options={"require": ["exp", "uid"]}
        )
    except:
        raise INVALID_CODE

    uid = data.get("uid")
    order = await PrizeOrder.find_one(PrizeOrder.uid == uid).project(PrizeOrderView)
    if order is None:
        raise ORDER_NOT_FOUND

    return order


@router.get(
    path="/{order_id}/code",
    status_code=status.HTTP_200_OK,
)
async def get_order_code(user_id: UIDDepends, order_id: str) -> str:
    order = await PrizeOrder.find(
        PrizeOrder.uid == order_id,
        PrizeOrder.user_id == user_id,
        projection_model=PrizeOrder
    ).exists()

    if not order:
        raise ORDER_NOT_FOUND

    return encode(
        {"uid": order_id, "exp": datetime.now(UTC) + timedelta(minutes=15)},
        key=JWT_KEY,
        algorithm="HS256",
    )


@router.get(
    path="/{order_id}/finish",
    status_code=status.HTTP_200_OK,
    dependencies=[AdminDepends]
)
async def finish_order(order_id: str) -> None:
    await PrizeOrder.find_one(PrizeOrder.uid == order_id).update(Set({PrizeOrder.finished: True})) # type: ignore
