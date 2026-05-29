
import click
from api.models import db, User, Asset

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.role = "inquilino"
            user.password = "123456"
            user.phone_prefix = "+34" 
            user.phone_number = f"60000000{x}"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

    @app.cli.command("insert-test-assets")
    def insert_test_assets():
        print("Creando activos de prueba...")
        assets = [
            {"name": "Caldera Central", "property_id": 1},
            {"name": "Ascensor Principal", "property_id": 1},
            {"name": "Puerta de Garaje", "property_id": 1},
            {"name": "Aire Acondicionado Central", "property_id": 1},
            {"name": "Bomba de Agua", "property_id": 1},
        ]
        for item in assets:
            existing = Asset.query.filter_by(name=item["name"], property_id=item["property_id"]).first()
            if not existing:
                new_asset = Asset(name=item["name"], property_id=item["property_id"])
                db.session.add(new_asset)
                print(f"Activo '{item['name']}' creado.")
        db.session.commit()
        print("Creación de activos completada.")