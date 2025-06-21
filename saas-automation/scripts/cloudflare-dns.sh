#!/bin/bash

# Cloudflare DNS Management Script

CLOUDFLARE_TOKEN=${CLOUDFLARE_TOKEN:-"your-cloudflare-token"}
CLOUDFLARE_ZONE_ID=${CLOUDFLARE_ZONE_ID:-"your-zone-id"}
DOMAIN="yourdomain.com"

create_dns_record() {
    local SUBDOMAIN=$1
    local TARGET=${2:-"server.yourdomain.com"}
    
    echo "🌍 Creating DNS record: $SUBDOMAIN.$DOMAIN -> $TARGET"
    
    RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{
            \"type\": \"CNAME\",
            \"name\": \"$SUBDOMAIN\",
            \"content\": \"$TARGET\",
            \"ttl\": 1,
            \"proxied\": true
        }")
    
    SUCCESS=$(echo $RESPONSE | jq -r '.success')
    
    if [ "$SUCCESS" == "true" ]; then
        echo "✅ DNS record created successfully"
        echo "🌐 $SUBDOMAIN.$DOMAIN is now pointing to $TARGET"
    else
        echo "❌ Failed to create DNS record"
        echo "Error: $(echo $RESPONSE | jq -r '.errors[0].message')"
        exit 1
    fi
}

delete_dns_record() {
    local SUBDOMAIN=$1
    
    echo "🗑️ Deleting DNS record: $SUBDOMAIN.$DOMAIN"
    
    # Get record ID
    RECORD_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records?name=$SUBDOMAIN.$DOMAIN" \
        -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
        -H "Content-Type: application/json" | jq -r '.result[0].id')
    
    if [ "$RECORD_ID" != "null" ] && [ "$RECORD_ID" != "" ]; then
        curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records/$RECORD_ID" \
            -H "Authorization: Bearer $CLOUDFLARE_TOKEN"
        echo "✅ DNS record deleted"
    else
        echo "⚠️ DNS record not found"
    fi
}

# Usage
case "$1" in
    "create")
        create_dns_record "$2" "$3"
        ;;
    "delete")
        delete_dns_record "$2"
        ;;
    *)
        echo "Usage: $0 {create|delete} SUBDOMAIN [TARGET]"
        echo "Examples:"
        echo "  $0 create vdc-hrms"
        echo "  $0 create vdc-hrms server.yourdomain.com"
        echo "  $0 delete vdc-hrms"
        ;;
esac