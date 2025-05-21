from beanie import Document, Indexed
from pydantic import (
    BaseModel,
    Field,
)

from typing import (
    Annotated,
    Literal,
    Optional,
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

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, self.__class__):
            return False
        return self.uid == value.uid

    class Settings:
        name = "Records"
        bson_encoders = {
            SnowflakeID: str
        }


class RecordUpdate(BaseModel):
    user_id: Optional[SnowflakeID] = None
    task_id: Optional[SnowflakeID] = None
    status: Optional[STATUS] = None


class RecordView(BaseModel):
    uid: SnowflakeID
    user_id: SnowflakeID
    task_id: SnowflakeID
    status: STATUS
