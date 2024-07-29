#!/bin/bash
curl -X POST -H "Content-Type: application/json" \
 -d '{"name":"Arto Hellas", "number":"44-44-44"}' http://localhost:3001/api/persons