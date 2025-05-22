from beanie import Document, Indexed
from pydantic import (
    BaseModel,
    Field,
)

from typing import Annotated

from config import INSTANCE_ID
from snowflake import SnowflakeGenerator, SnowflakeID

uid_generator = SnowflakeGenerator(INSTANCE_ID)


class PrizeOrder(Document):
    uid: Annotated[SnowflakeID, Indexed(unique=True)] = Field(
        title="UID",
        description="UID of order, use snowflake format.",
        default_factory=uid_generator.next_id,
        examples=["6209533852516352"]
    )
    user_id: SnowflakeID = Field(
        title="User ID",
        description="UID of user, use snowflake format.",
        examples=["6209533852516352"]
    )
    prize_id: SnowflakeID = Field(
        title="Prize ID",
        description="UID of prize, use snowflake format.",
        examples=["6209533852516352"]
    )
    finished: bool = Field(
        default=False,
        title="Finished",
        description="Whether the order is finished.",
        examples=[True]
    )

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, self.__class__):
            return False
        return self.uid == value.uid

    class Settings:
        name = "PrizeOrders"
        bson_encoders = {
            SnowflakeID: str
        }


class PrizeOrderView(BaseModel):
    uid: SnowflakeID
    user_id: SnowflakeID
    prize_id: SnowflakeID
    finished: bool
