#!/bin/bash
# Script para iniciar en modo Desarrollo
cp nginx/gateway.dev.conf nginx/gateway.conf
docker compose up -d
