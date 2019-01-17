# LIFE PAYT SOFTWARE

## Software Description

This software aims to retrieve and present information about the usage of PAYT (Pay-as-you-throw) systems. The data can be retrieved through specific API's or directly implemented in the software platform. The client information can be added by uploading Excel files that the municipalities have. Through Excel files can also be added billing information if the municipality decides to calculate the fees outside of this platform.

The file parsers accept xsl or csv file formats and can adapted as desired. There is also a module called 'citibrain' which represents an example of how the data can be obtained from an specific API.

This software was built with multitenancy in mind, which means that each municipality can have its own database and software running without interfearance from others. To add new municipalities, or tenants, the Makefile or the Docker compose file can easily be modified for that purpose.

In each module there is a package that is installed within each container named 'yaasc', which creates an interface for the async.io library. You can add this to a repo and download it whenever the container is executed.

To start executing the whole system there are two ways to do it: through the Makefile or directly from the Docker compose file. In the Docker compose file there is no database initiated. This is because it was primarly used on the production server which had a local database. The Makefile which was used for local testing required a test database and that runned in an isolated container.

Within each module there is a SQL script which initiates the databases whenever a module is started.


## Authentication Module and Database


## Tenant Module and Database


## Execution and setup