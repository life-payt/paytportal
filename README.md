# LIFE PAYT SOFTWARE

## Software Description

This software aims to retrieve and present information about the usage of PAYT (Pay-as-you-throw) systems. The data can be retrieved through specific API's or directly implemented in the software platform. The client information can be added by uploading Excel files that the municipalities have. Through Excel files can also be added billing information if the municipality decides to calculate the fees outside of this platform.

The file parsers accept xsl or csv file formats and can adapted as desired. There is also a module called 'api_worker' which represents an example of how the data can be obtained from an specific API. There will be published an API for the users of this software to send their data, rather than the portal itself gathering all the data, giving control to the entities for posting data as will.

This software was built with multitenancy in mind, which means that each municipality can have its own database and software running without interfearance from others. To add new municipalities, or tenants, the Makefile or the Docker compose file can easily be modified for that purpose.

In each module there is a package that is installed within each container named 'yaasc', which creates an interface for the async.io library. You can add this to a repo and download it whenever the container is executed.


## Execution and setup

To start executing the whole system there are two ways to do it: through the Makefile or directly from the Docker compose file. In the Docker compose file there is no database initiated. This is because it is primarly used on the production server which had a local database. The Makefile which was used for local testing required a test database and that runned in an isolated container.

So to run this software locally, the recommendation is to use the Makefile which creates the databases and gets everything running.

The most important commands to run with the makefile are: 'build_all' and 'run_all', which can be executed by the command 'all'.


## Wiki

There are some things to take into consideration for a more personalised execution and to make updates to suit your needs. For that we advise to take a look at the project [Wiki](https://github.com/life-payt/paytportal/wiki/PAYT-Portal-Wiki).
