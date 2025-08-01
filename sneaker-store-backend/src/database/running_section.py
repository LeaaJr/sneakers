from sqlalchemy import Column, String, Integer
from src.database import Base

class RunningSectionDetail(Base):
    __tablename__ = "running_section_details"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title = Column(String, nullable=False)
    description = Column(String)
    image_url = Column(String)
    display_order = Column(Integer, default=0)