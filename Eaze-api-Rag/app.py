# app.py
from flask import Flask, request, jsonify
from pydantic import ValidationError
from search import Route, searchApi, ServiceController, AdvanceSearchDTO, responseDTO

app = Flask(__name__)

# Define an endpoint for AdvanceSearch
@app.route("/AdvanceSearch", methods=["POST"])
def advance_search():
    try:
        # Parse incoming JSON to an AdvanceSearchDTO object
        data = request.get_json()
        advance_searchDTO = AdvanceSearchDTO(**data)
        route = advance_searchDTO.route  # Validate and create Route object

        # Call the searchApi function with the provided route data
        result = searchApi(route)

        # Build a responseDTO with schemaName and the service/controller strings
        response = responseDTO(
            service=result['service'],
            controller=result['controller'],
            schemaName=advance_searchDTO.schemaName
        )

        # Return the result as JSON
        return jsonify(response.__dict__)
    except ValidationError as e:
        return jsonify({"error": "Invalid input", "details": e.errors()}), 400
    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
