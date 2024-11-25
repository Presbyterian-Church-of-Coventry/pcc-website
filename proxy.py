from flask import Flask, request, Response
import requests

app = Flask(__name__)


@app.route("/", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"])
def proxy():
    url = request.args.get("url")
    if not url:
        return "Missing url parameter", 400

    try:
        # Forward the original request headers
        headers = {
            key: value
            for key, value in request.headers.items()
            if key.lower()
            not in ["host", "content-length", "content-encoding", "transfer-encoding"]
        }

        # Always accept any content type
        headers["Accept"] = "*/*"

        # Forward the request with original method and headers
        params = dict(request.args)
        params.pop("url", None)  # Remove url param while preserving all others

        response = requests.request(
            method=request.method,
            url=url,
            headers=headers,
            data=request.get_data(),
            params=params,
            stream=True,
        )

        # Filter response headers to avoid encoding conflicts
        excluded_headers = [
            "content-encoding",
            "content-length",
            "transfer-encoding",
            "connection",
        ]
        headers = [
            (name, value)
            for (name, value) in response.raw.headers.items()
            if name.lower() not in excluded_headers
        ]

        # Return response with filtered headers and stream the content
        return Response(
            response.iter_content(chunk_size=1024),
            status=response.status_code,
            headers=headers,
            mimetype=response.headers.get("content-type", "application/octet-stream"),
            direct_passthrough=True,
        )

    except Exception as e:
        return str(e), 500


if __name__ == "__main__":
    app.run(port=3002)
