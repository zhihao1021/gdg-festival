from beanie import Document, Indexed
from pydantic import (
    BaseModel,
    Field,
    field_serializer,
    field_validator
)

from datetime import datetime
from typing import (
    Annotated,
    Literal,
    Optional,
    Union
)

from config import INSTANCE_ID
from snowflake import SnowflakeGenerator, SnowflakeID

uid_generator = SnowflakeGenerator(INSTANCE_ID)

STATUS = Literal["acquired", "pending", "finished"]


class Record(Document):
    uid: Annotated[SnowflakeID, Indexed(unique=True)] = Field(
        title="UID",
        description="UID of record, use snowflake format.",
        default_factory=uid_generator.next_id,
        examples=["6209533852516352"]
    )
    user_id: SnowflakeID = Field(
        title="User ID",
        description="UID of user, use snowflake format.",
        examples=["6209533852516352"]
    )
    task_id: SnowflakeID = Field(
        title="Task ID",
        description="UID of task, use snowflake format.",
        examples=["6209533852516352"]
    )
    status: STATUS = Field(
        title="Status",
        description="Status of record.",
        examples=["acquired", "pending", "finished"]
    )
    time_limit: datetime = Field(
        title="Time Limit",
        description="Time limit of record.",
        examples=["2023-10-01T00:00:00Z"]
    )

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, self.__class__):
            return False
        return self.uid == value.uid

    @field_validator("time_limit", mode="before")
    @classmethod
    def valid_release_date(cls, value: Union[int, datetime]):
        if isinstance(value, int):
            return value

        try:
            return int(value.timestamp())
        except:
            raise ValueError

    class Settings:
        name = "TaskRecords"
        bson_encoders = {
            SnowflakeID: str
        }


class RecordView(BaseModel):
    uid: SnowflakeID
    user_id: SnowflakeID
    task_id: SnowflakeID
    status: STATUS
    time_limit: int

    @field_validator("time_limit", mode="before")
    @classmethod
    def valid_release_date(cls, value: Union[int, datetime]):
        if isinstance(value, int):
            return value

        try:
            return int(value.timestamp())
        except:
            raise ValueError
