#!/bin/bash
echo "🔐 Requesting SSL Certificate for all domains..."
echo "================================================"
echo ""

aws acm request-certificate \
  --domain-name tis-holdings.com \
  --subject-alternative-names \
    "www.tis-holdings.com" \
    "esgnavigator.ai" \
    "www.esgnavigator.ai" \
    "tis-intellimat.net" \
    "www.tis-intellimat.net" \
  --validation-method DNS \
  --region us-east-1 \
  --output json

echo ""
echo "✅ Certificate requested!"
echo ""
echo "NEXT STEPS:"
echo "1. Copy the Certificate ARN from above"
echo "2. Go to AWS Console → Certificate Manager (us-east-1)"
echo "3. Click on your certificate"
echo "4. Copy the DNS validation records"
echo "5. Add them to your domain DNS settings"
echo ""
echo "⏰ Validation usually takes 5-30 minutes after DNS records are added"
