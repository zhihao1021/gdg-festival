from beanie import Document

from snowflake import SnowflakeID


class PrizeImage(Document):
    prize_id: SnowflakeID
    content_type: str
    data: bytes

    class Settings:
        name = "PrizeImages"
        bson_encoders = {
            SnowflakeID: str
        }
