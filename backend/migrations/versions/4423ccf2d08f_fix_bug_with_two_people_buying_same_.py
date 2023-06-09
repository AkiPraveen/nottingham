"""fix bug with two people buying same ticker

Revision ID: 4423ccf2d08f
Revises: 406dc8ed007a
Create Date: 2023-03-29 16:27:49.938905

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4423ccf2d08f'
down_revision = '406dc8ed007a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('position', schema=None) as batch_op:
        batch_op.drop_constraint('position_ticker_key', type_='unique')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('position', schema=None) as batch_op:
        batch_op.create_unique_constraint('position_ticker_key', ['ticker'])

    # ### end Alembic commands ###
