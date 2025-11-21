SETUP VIRTUAL ENVIRONMENT (In Backend Directory)
>> python3 -m venv venv (create)
>> source venv/bin/activate (activate)
>> deactivate

INSTALL REQUIREMENTS
>> pip install -r requirements.txt
>> pip list

CREATE .ENVIRONMENT
- in backend directory, create .env file
    - FINNHUB_API_KEY=YOUR_API_KEY

RUN BACKEND
>> uvicorn main:app --reload