from setuptools import setup, find_packages

PKG_NAME = 'src'
REQUIREMENTS = [line.strip() for line in open("requirements.txt").readlines()]

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()


setup(
    name=PKG_NAME,
    version='0.0.1',
    author="Jorge A. Massih",
    author_email="jorgmassih@gmail.com",
    description="Github Secrets Uploading automate tool",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Jorgmassih/github-secrets-uploader",
    project_urls={
        "Bug Tracker": "https://github.com/Jorgmassih/github-secrets-uploader/issues",
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: Unix",
        "Development Status :: 3 - Alpha",
        "Environment :: Web Environment",
        "Framework :: FastAPI",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Documentation"
    ],
    install_requires=REQUIREMENTS,
    tests_require=['unittest'],
    python_requires=">=3.5.0",
    packages=find_packages(),
    include_package_data=True,
)