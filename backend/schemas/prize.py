from beanie import Document, Indexed
from pydantic import BaseModel, Field

from typing import Annotated, Optional

from config import INSTANCE_ID
from snowflake import SnowflakeID, SnowflakeGenerator

uid_generator = SnowflakeGenerator(INSTANCE_ID)


class Prize(Document):
    uid: Annotated[SnowflakeID, Indexed(unique=True)] = Field(
        title="UID",
        default_factory=uid_generator.next_id,
        description="UID of prize, use snowflake format.",
        examples=["6209533852516352"]
    )
    title: str = Field(
        title="Title",
        description="Title of prize.",
        examples=["Best Paper Award"]
    )
    description: str = Field(
        title="Description",
        description="Description of prize.",
        examples=["This is the best paper award."]
    )
    total_count: int = Field(
        title="Total Count",
        description="Total count of prize.",
        examples=[10]
    )
    cost: int = Field(
        title="Cost",
        description="Cost of prize.",
        examples=[1000]
    )

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, self.__class__):
            return False
        return self.uid == value.uid

    class Settings:
        name = "Prizes"
        bson_encoders = {
            SnowflakeID: str
        }


class PrizeCreate(BaseModel):
    title: str
    description: str
    total_count: int
    cost: int


class PrizeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    total_count: Optional[int] = None
    cost: Optional[int] = None


class PrizeView(BaseModel):
    uid: SnowflakeID
    title: str
    description: str
    total_count: int
    cost: int
