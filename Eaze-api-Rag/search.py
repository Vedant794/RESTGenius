# search.py
from pydantic import BaseModel
from typing import List
from dataclasses import dataclass
import json
import re
from langchain_openai import AzureChatOpenAI
from langchain.prompts import PromptTemplate

class Criteria(BaseModel):
    targetVar: str
    operationType: str
    valueType: str

class Route(BaseModel):
    url: str
    service_name: str
    controller_name: str
    criterias: List[Criteria]

class AdvanceSearchDTO(BaseModel):
    schemaName:str
    route:Route

@dataclass
class ServiceController:
    service: str
    controller: str

@dataclass
class responseDTO:
    service: str
    controller: str
    schemaName: str    

def searchApi(route: Route) -> ServiceController:
    # Prepare the prompt for the LLM
    print("running")
    criteria_descriptions = [
        f"target variable '{criteria.targetVar}' with operation type '{criteria.operationType}' "
        f"and value type '{criteria.valueType}'"
        for criteria in route.criterias
    ]
    print("Request received for processing.")
    print(criteria_descriptions)
    criteria_str = "\n".join(criteria_descriptions)

    prompt = f"""
    I have a Route object with the following attributes:
    - URL: '{route.url}'
    - Service Name: '{route.service_name}'
    - Controller Name: '{route.controller_name}'
    - Criterias (list of criteria objects):'{criteria_descriptions}'
       

    Use this information to generate a **Spring Boot service method** and a **controller method**. Only provide the specific methods without extra class-level details. The service method should be named '{route.service_name}' and the controller method should be named '{route.controller_name}'. Use MongoTemplate for querying.

    ### Expected JSON Output
    Please provide the output as a JSON object with only two fields: **"service"** and **"controller"**, each containing a string of the corresponding Java method code.
    
    #### JSON Format Example:
    ```json
    {{
      "service": "public void {route.service_name}(...) {{ ... }}",
      "controller": "public void {route.controller_name}(...) {{ ... }}"
    }}
    ```

    ### Important Notes:
    1. The output should be a valid JSON object that is **directly parseable**.
    2. No extra comments or explanations outside the JSON structure.

    Now, based on this information, please provide the **exact JSON structure** containing the service and controller methods.
    """

    # Initialize the AzureChatOpenAI model
    llm = AzureChatOpenAI(
        azure_deployment="gpt-4",
        api_version="2024-08-01-preview",
        temperature=0.2,
        max_tokens=None,
        max_retries=2,
    )

    # Define a prompt template
    template = PromptTemplate(
        input_variables=["prompt"],
        template="{prompt}"
    )

    # Create a runnable sequence
    runnable_chain = template | llm

    # Run the chain with the prepared prompt
    response = runnable_chain.invoke({
        "prompt": prompt
    })

    # Extract the JSON part from the response
    json_string = extract_json(response.content)
    
    # Convert the JSON string to a ServiceController object
    return json.loads(json_string)  # Assuming the response is valid JSON

def extract_json(response: str) -> str:
    """Extract the JSON part from the response string."""
    # Use regex to find the JSON object
    match = re.search(r'\{.*\}', response, re.DOTALL)
    if match:
        json_str = match.group(0)
        # Check if JSON is valid
        try:
            json.loads(json_str)  # Attempt parsing to confirm validity
            return json_str
        except json.JSONDecodeError:
            print("Parsing error, response was not valid JSON.")
            json_str = json_str.replace("'", "\"")  # Convert to double quotes
            return json_str  # Re-attempt parsing after formatting
    raise ValueError("No valid JSON found in the response.")
