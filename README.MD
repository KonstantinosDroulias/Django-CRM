# How To run Locally

Install the files.

```bash
Python -m venv .venv
# Activate the environment
For Windows : .venv\Scripts\activate
For Mac : source .venv/bin/activate
```
```bash
# Install Requirements
pip install -r requirements.txt
# Note: Might need to run npm install for tailwind not sure. If you need npm run watch:css then you defenatly need it
```
```bash
# Might Also need to create a .env file with:
SECRET_KEY='randomstring'
DEBUG=True
```
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```


## Users to login <br>
Admin: <br>
Username: Admin Password: 123Test123 <br>
Employee: <br>
Username: Dave Password: 123Test123 <br>
Manager: <br>
Username: Steve Password: 123Test123 <br>
