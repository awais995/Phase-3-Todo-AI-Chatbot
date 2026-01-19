import uvicorn

if __name__ == "__main__":
    print("Starting server with debug mode enabled...")
    print("Environment variables loaded:")
    import os
    print(f"DEBUG: {os.getenv('DEBUG')}")
    print(f"BETTER_AUTH_SECRET length: {len(os.getenv('BETTER_AUTH_SECRET', ''))}")

    from config import SECRET_KEY
    print(f"Loaded SECRET_KEY length: {len(SECRET_KEY)}")

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)