"""add resolved_at to incidence

Revision ID: 3a9f1b2c8d7e
Revises: 2782a8e0b300
Create Date: 2026-06-08 11:50:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3a9f1b2c8d7e'
down_revision = '2782a8e0b300'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('incidence', schema=None) as batch_op:
        batch_op.add_column(sa.Column('resolved_at', sa.DateTime(), nullable=True))


def downgrade():
    with op.batch_alter_table('incidence', schema=None) as batch_op:
        batch_op.drop_column('resolved_at')
