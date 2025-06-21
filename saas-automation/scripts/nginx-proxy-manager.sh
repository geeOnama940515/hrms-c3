#!/bin/bash

# Nginx Proxy Manager API Integration

NPM_URL="http://your-npm:81"
NPM_TOKEN="your-npm-jwt-token"

create_proxy_host() {
    local SUBDOMAIN=$1
    local PORT=$2
    local DOMAIN="yourdomain.com"
    
    echo "🔗 Creating proxy host: $SUBDOMAIN.$DOMAIN -> localhost:$PORT"
    
    RESPONSE=$(curl -s -X POST "$NPM_URL/api/nginx/proxy-hosts" \
        -H "Authorization: Bearer $NPM_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{
            \"domain_names\": [\"$SUBDOMAIN.$DOMAIN\"],
            \"forward_scheme\": \"http\",
            \"forward_host\": \"localhost\",
            \"forward_port\": $PORT,
            \"access_list_id\": 0,
            \"certificate_id\": 0,
            \"ssl_forced\": true,
            \"caching_enabled\": false,
            \"block_exploits\": true,
            \"advanced_config\": \"\",
            \"meta\": {
                \"nginx_online\": true,
                \"nginx_err\": null
            },
            \"allow_websocket_upgrade\": false,
            \"http2_support\": true,
            \"forward_host_header\": false,
            \"ssl_forced_hsts_enabled\": true,
            \"ssl_forced_hsts_subdomains\": true,
            \"locations\": []
        }")
    
    ID=$(echo $RESPONSE | jq -r '.id')
    
    if [ "$ID" != "null" ] && [ "$ID" != "" ]; then
        echo "✅ Proxy host created with ID: $ID"
        
        # Request SSL certificate
        echo "🔒 Requesting SSL certificate..."
        curl -s -X POST "$NPM_URL/api/nginx/certificates" \
            -H "Authorization: Bearer $NPM_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{
                \"provider\": \"letsencrypt\",
                \"domain_names\": [\"$SUBDOMAIN.$DOMAIN\"],
                \"meta\": {
                    \"letsencrypt_agree\": true,
                    \"letsencrypt_email\": \"admin@yourdomain.com\"
                }
            }"
        
        echo "✅ SSL certificate requested"
    else
        echo "❌ Failed to create proxy host"
        echo "Response: $RESPONSE"
        exit 1
    fi
}

delete_proxy_host() {
    local SUBDOMAIN=$1
    local DOMAIN="yourdomain.com"
    
    echo "🗑️ Deleting proxy host: $SUBDOMAIN.$DOMAIN"
    
    # Get proxy host ID
    HOST_ID=$(curl -s -X GET "$NPM_URL/api/nginx/proxy-hosts" \
        -H "Authorization: Bearer $NPM_TOKEN" | \
        jq -r ".[] | select(.domain_names[] | contains(\"$SUBDOMAIN.$DOMAIN\")) | .id")
    
    if [ "$HOST_ID" != "" ] && [ "$HOST_ID" != "null" ]; then
        curl -s -X DELETE "$NPM_URL/api/nginx/proxy-hosts/$HOST_ID" \
            -H "Authorization: Bearer $NPM_TOKEN"
        echo "✅ Proxy host deleted"
    else
        echo "⚠️ Proxy host not found"
    fi
}

# Usage
case "$1" in
    "create")
        create_proxy_host "$2" "$3"
        ;;
    "delete")
        delete_proxy_host "$2"
        ;;
    *)
        echo "Usage: $0 {create|delete} SUBDOMAIN [PORT]"
        echo "Examples:"
        echo "  $0 create vdc-hrms 3001"
        echo "  $0 delete vdc-hrms"
        ;;
esac