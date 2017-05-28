from flask import Flask, request, json, jsonify
import graphene

app = Flask(__name__)

# routing
# http://flask.pocoo.org/docs/0.12/quickstart/#routing

@app.route("/")
def hello():
    return "Hello World!"

# json
@app.route("/hello-json")
def helloJson():
    try:

        # Initialize a member list
        memberList = []

        # create a instances for filling up member list
        for i in range(0,1):
            memDict = {
                'firstName': 'Kevin',
                'lastName': 'Hart'}
            memberList.append(memDict)

        # convert to json data
        jsonStr = json.dumps(memberList)

    # print errors
    except Exception ,e:
        print str(e)

    return jsonify(Members=jsonStr)

# REST
@app.route("/hello-rest", methods=['GET', 'POST'])
def rest():
    if request.method == 'GET':
      return "Look I'm doing REST in Python"

# Graphene (GraphQL)
# TODO http://docs.graphene-python.org/projects/sqlalchemy/en/latest/tutorial/
@app.route("/hello-graphql")
def graphQl():
    # create class
    class Query(graphene.ObjectType):
      hello = graphene.String()

      def resolve_hello(self, args, context, info):
        print('args', args);
        return 'Look I\'m doing GraphQl with Python!'

    # assign schema
    schema = graphene.Schema(query=Query)

    # execute schema
    result = schema.execute('{ hello }')

    return result.data['hello']


# run app
if __name__ == "__main__":
    app.run()
