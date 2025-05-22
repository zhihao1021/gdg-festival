from beanie import Document, Indexed
from pydantic import (
    BaseModel,
    Field,
    field_validator,
    field_serializer
)

from datetime import datetime
from typing import Annotated, Optional, Union

from config import INSTANCE_ID
from snowflake import SnowflakeGenerator, SnowflakeID

uid_generator = SnowflakeGenerator(INSTANCE_ID)


class Task(Document):
    uid: Annotated[SnowflakeID, Indexed(unique=True)] = Field(
        title="UID",
        description="UID of task, use snowflake format.",
        default_factory=uid_generator.next_id,
        examples=["6209533852516352"]
    )
    title: str = Field(
        title="Title",
        description="Title of task.",
        examples=["Task Title"],
    )
    description: str = Field(
        title="Description",
        description="Description of task.",
        examples=["Task Description"],
    )
    points: int = Field(
        title="Points",
        description="Points of task.",
        examples=[100],
    )
    total_count: int = Field(
        title="Total Count",
        description="Total count of task.",
        examples=[100],
    )
    level: int = Field(
        default=0,
        title="Level",
        description="Level of task.",
        examples=[0],
    )
    display: bool = Field(
        default=True,
        title="Display",
        description="Whether the task is displayed.",
        examples=[True],
    )
    release_date: datetime = Field(
        default_factory=datetime.now,
        title="Release Date",
        description="Release date of task.",
        examples=[1737170068],
    )
    time_limit: int = Field(
        default=0,
        title="Time Limit",
        description="Time limit of task.",
        examples=[0],
    )
    method: str = ""
    link: str = ""

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, self.__class__):
            return False
        return self.uid == value.uid

    @field_validator("release_date", mode="before")
    @classmethod
    def valid_release_date(cls, value):
        if isinstance(value, datetime):
            return value

        try:
            return datetime.fromtimestamp(value)
        except:
            raise ValueError

    class Settings:
        name = "Tasks"
        bson_encoders = {
            SnowflakeID: str
        }
        max_nesting_depth = 1


class TaskCreate(BaseModel):
    title: str = ""
    description: str = ""
    points: int
    total_count: int
    level: int
    display: bool
    release_date: int
    time_limit: int = 0
    method: str = ""
    link: str = ""


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    points: Optional[int] = None
    total_count: Optional[int] = None
    level: Optional[int] = None
    display: Optional[bool] = None
    release_date: Optional[int] = None
    time_limit: Optional[int] = None
    method: Optional[str] = None
    link: Optional[str] = None

    @field_serializer("release_date")
    def valid_release_date(self, release_date: int):
        return datetime.fromtimestamp(release_date)


class TaskView(BaseModel):
    uid: SnowflakeID
    title: str
    description: str
    points: int
    total_count: int
    level: int
    display: bool
    release_date: int
    time_limit: int
    method: str
    link: str

    @field_validator("release_date", mode="before")
    @classmethod
    def valid_release_date(cls, value: Union[int, datetime]):
        if isinstance(value, int):
            return value

        try:
            return int(value.timestamp())
        except:
            raise ValueError
