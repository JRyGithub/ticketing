# ticketing
A "StubHub" like web application utilising Microservices.

k create secret generic jwt-secret --from-literal=JWT_KEY=
k create secret generic stripe-secret --from-literal STRIPE_KEY=sk_test_51KgC6SI655UVTpYdVVMZmKDLotYOQT4O13haPs3ZzF8XWzlcOKsnWWSS99yQr91syXasQ7QXArM6Kk3lBm4JWO7G00yRgb1eyj
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/cloud/deploy.yaml