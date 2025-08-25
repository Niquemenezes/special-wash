"""drop observaciones from RegistroEntradaProducto

Revision ID: auto_drop_observaciones
Revises: 
Create Date: 2025-08-25 14:20:10

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'auto_drop_observaciones'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('registro_entrada_producto', schema=None) as batch_op:
        try:
            batch_op.drop_column('observaciones')
        except Exception:
            # Si ya no existe, ignoramos
            pass

def downgrade():
    with op.batch_alter_table('registro_entrada_producto', schema=None) as batch_op:
        batch_op.add_column(sa.Column('observaciones', sa.Text(), nullable=True))
