import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function APIArchitect() {
  const [apiSchema, setApiSchema] = useState('')

  const handleGetStarted = () => {
    alert("Welcome to API Architect! Let's get started with your API design.")
  }

  const handleApiSchemaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApiSchema(event.target.value)
    console.log('API Schema updated:', event.target.value)
    // Here you can add logic to process or validate the API schema
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">API Architect</CardTitle>
        </CardHeader>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>api.schema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Comprehensively define your RESTful service using a user-friendly JSON structure. Begin by crafting a service below, or download a{" "}
            <a href="#" className="text-blue-600 hover:underline">sample</a>.
          </p>
          <p className="mb-2">
            API Architect offers an easy-to-grasp format that can be quickly learned from our{" "}
            <a href="#" className="text-blue-600 hover:underline">documentation</a>{" "}
            or by exploring community-contributed{" "}
            <a href="#" className="text-blue-600 hover:underline">open APIs</a>.
          </p>
          <p className="mb-4">
            API Architect also accommodates alternative input formats, such as Avro IDL and OpenAPI 3.0.
          </p>
          <Textarea
            value={apiSchema}
            onChange={handleApiSchemaChange}
            placeholder="Enter your API schema here"
            className="w-full min-h-[150px]"
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Smart defaults over complex setup</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">
            Begin by outlining your data models. Then, link these models to endpoints that provide the specific functionalities you wish to offer.
          </p>
          <p>
            api.schema is engineered to encourage developers to thoughtfully design their APIs, while simplifying the process of creating services that adhere to RESTful principles. By prioritizing smart defaults in key areas, it empowers developers to craft high-quality REST APIs with ease.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Lightweight native SDKs with minimal dependencies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Access native SDKs with few (if any) external dependencies. We've put significant effort into ensuring these SDKs are intuitive and enjoyable to work with.
          </p>

          <h3 className="text-lg font-semibold mb-2">Ruby SDK Example:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4">
            <code>{`api = MyService::API.new("http://localhost:8000")

companies = api.companies.fetch(limit: 10, offset: 0)
companies.each do |company|
  puts "Company #{company.id} is called #{company.name}"
end

new_company = api.companies.create(name: "New Co")
puts "Created new company called #{new_company.name}"
`}</code>
          </pre>

          <h3 className="text-lg font-semibold mb-2">Scala SDK Example:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{`val api = new io.apiarchitect.sdk.v1.API("http://localhost:8000")

val companies = api.companies.fetch(limit = 10, offset = 0)
companies.foreach { company =>
  println(s"Company ${company.name} has ID ${company.id}")
}

val newCompany = api.companies.create(name = "New Co")
println(s"Created new company called ${newCompany.name}")
`}</code>
          </pre>
        </CardContent>
      </Card>

      <Button onClick={handleGetStarted}>Get Started</Button>
    </div>
  )
}
