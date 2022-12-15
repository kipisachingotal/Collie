import awsgi
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

@app.errorhandler(404)
def resource_not_found(error):
    return jsonify(message=str(error))

@app.errorhandler(500)
def server_error(error):
    return jsonify(message=str(error))

@app.route("/health")
@cross_origin()
def health():
    return jsonify(message="API health is good")

def handler(event, context):
  print('received event:')
  print(event)
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps('Hello from your new Amplify Python lambda!')
  }
