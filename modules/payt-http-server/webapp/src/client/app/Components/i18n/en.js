// en.js
export default {
    General: {
        Login: {
            invalidCredentials: 'Invalid credentials',
            temporarilySuspended: 'User account blocked for ',
            accountBlocked: 'User account permanently blocked, please contact the administration',
            signin: ' Login',
            username: 'Username',
            password: 'Password',
            rememberme: 'Remember me',
            resetPassword: 'Reset password',
        },
        Signup: {
            requiredFields: 'Required fields',
            cpErrorNotMatch: "Password and confirmation don't match",
            cpErrorLength: 'Password has less than 8 characters',
            signup: ' Signup',
            infoText: 'You are currently logging in for the first time, please fill in your email address and change your password before continuing.',
            password: 'Password',
            cpassword: 'Confirmation Password',
            submit: 'Submit',
        },
        ResetPassword: {
            rpError: 'Masterkey invalid, please try again',
            title: 'Reset password',
            infoText: 'In order to reset your password please fill in your client number and the masterkey present in the card you got after opt in the project. If succeeded your password will be the same masterkey, which you can change anytime.',
            username: 'Client Nr',
            masterkey: 'Masterkey',
            submit: 'Submit',
        },
        Main: {
            stats: 'Stats',
            nrUsers: "Number of users",
            nrContainers: "Containers Installed",
            nrCounties: "Counties involved",
            totalWaste: "Total of waste collected",
            avgMonthWaste: "Month average of waste production",
        },
        Logo: {
            signin: ' Login ',
        },
        Footer: {
            partners: 'Partners',
        },
    },
    Header: {
        signOut: 'Sign out'
    },
    Content: {
        controlPanel: 'Control Panel',
        home: 'Home'
    },
    NormalSideBar: {
        mainMenu: 'MAIN MENU',
        containers: 'Containers',
        bills: 'Bills',
        settings: 'Settings',
        usages: 'Nr of usages',
        help: 'Help'
    },
    NormalBusinessSideBar: {
        mainMenu: 'MAIN MENU',
        simulText: "Bills' Simulator",
        settings: 'Settings',
        help: 'Help'
    },
    AdminSideBar: {
        mainMenu: 'MAIN MENU',
        general: 'General',
        userManagement: 'User Management',
        services: 'Services Management',
        policies: 'Policies Management',
        settings: 'Settings',
        help: 'Help'
    },
    MunSideBar: {
        mainMenu: 'MAIN MENU',
        generalStats: 'General Statistics',
        containers: 'Containers',
        users: 'Producers',
        cards: 'Cards management',
        upload: 'File Upload',
        settings: 'Settings',
        help: 'Help'
    },
    MunBusinessSideBar: {
        mainMenu: 'MAIN MENU',
        generalStats: 'General Statistics',
        producers: 'Producers',
        upload: 'File Upload',
        settings: 'Settings',
        help: 'Help'
    },
    RowAddress: {
        realTitle: "Last month's real bill",
        simulTitle: "Last month's simulated bill",
        labelKnob: 'Personal',
        unit: ' €',
        errorMsg: 'No Data'
    },
    RowAddressBusiness: {
        realTitle: "Last month's real bill",
        simulTitle: "Last month's simulated bill",
        labelKnob: 'Personal',
        unit: ' €',
        errorMsg: 'No Data'
    },
    ContainersNormal: {
        gmapTitle: "Containers' Location",
        markerName: 'Container',
        totalReal: "Total of last month's real bill",
        totalSimul: "Total of last month's simulated bill",
        unit: ' €',
        lineChartTitle: 'Real value vs Simulated value'
    },
    TotalNormalBusiness: {
        gmapTitle: "Instalations' Location",
        markerName: 'Instalation',
        totalReal: "Total of last month's real bill",
        totalSimul: "Total of last month's simulated bill",
        unit: ' €',
        lineChartTitle: 'Real value vs Simulated value'
    },
    NormalContent: {
        textChart: 'Evolution of waste produced',
        dataLabel: 'Waste produced'
    },
    BusinessContent: {
        textLineChart: 'Evolution of waste produced',
        dataLabel: 'Waste produced'
    },
    CountyNormalContent: {
        unit: ' €',
        activeUsers: 'Active Users',
        dayPref: "Day with most waste produced",
        weekPref: "Week with most waste produced",
        monthPref: "Month with most waste produced in the last 12 months",
        totalReal: "Total of last month's real bill",
        totalSimul: "Total of last month's simulated bill",
        dataLabel: 'Waste produced',
        barTitle: 'Evolution of waste production',
        errorMsg: 'No Data'
    },
    Users: {
        title: "Producers' List",
        searchPlaceholder: 'Search',
        clear: 'Clear',
        name: 'Name',
        mail: 'E-mail',
        address: 'Address',
        cards: 'Cards associated',
        last_access: 'Last access',
        state: 'State',
        actions: 'Actions',
        checkCards: 'Manage Cards',
        modalTitle: 'Cards Associated',
    },
    Cards: {
        addCardModalTitle: 'Add Card',
        btnDelete: 'Delete selected',
        showOwner: 'Show Owner',
        noOwner: 'No owner',
        showOwnerModalTitle: 'Owner',
        title: 'List of Cards',
        nrCard: 'Card nr',
        cardOwner: 'Card Owner'
    },
    HistoryCardTable: {
        message: 'Description',
        producer: 'Producer',
        timestamp: 'Date',
    },
    OwnerProfileCard: {
        name: 'Name',
        address: 'Address',
        city: 'City',
        zipcode: 'ZIP Code',
    },
    IDCardForm: {
        cardId: 'Card ID',
        card: 'Card',
        submit: 'Submit'
    },
    ServicesTable: {
        modalTitle: 'Add Service',
        title: 'Services',
        searchPlaceholder: 'Search',
        clear: 'Clean',
        name: 'Name',
        actions: 'Actions',
        start: 'Start',
        stop: 'Stop',
        remove: 'Remove',
        key: 'Key',
        started: 'Started',
        stopped: 'Stopped',
        status: 'Status',
        add: 'Add',
    },
    ServiceForm: {
        name: 'Name',
        key: 'Key',
        submit: 'Confirm'
    },
    AdminPolicies: {
        noFilter: 'All',
        filter: 'Filter: ',
    },
    PoliciesTable: {
        title: 'Policies',
        searchPlaceholder: 'Search',
        clear: 'Clean',
        field: 'Field',
        policy: 'Policy',
    },
    PermissionsTable: {
        title: 'Permissions',
        searchPlaceholder: 'Search',
        clear: 'Clean',
        function: 'Function',
        permission: 'Permission',
        operation: 'Operation',
    },
    CountyBusinessContent: {
        unit: ' €',
        highProd: 'Higher waste production',
        lowProd: 'Lower waste production',
        highSep: 'Higher separation rate',
        lowSep: 'Lower separation rate',
        totalReal: "Total of last month's real bill",
        totalSimul: "Total of last month's simulated bill",
    },
    ProducersContent: {
        markerName: 'Instalation',
        gmapTitle: "Instalations' Location",
        map: 'Map',
        table: 'Table'
    },
    ContainersContent: {
        markerName: 'Container',
        gmapTitle: "Containers' location",
    },
    ContainerLineChart: {
        label: 'Openings',
        title: "Usage of container ",
    },
    ContainerTabs: {
        title: "Instalations' Location",
    },
    BoxHeader: {
        prefixTitle: 'Instalation ',
        suffixTitle: ' - Capacity installed',
    },
    SimpleMap: {
        indif: 'Mixed',
        plast: 'Plastic',
        glass: 'Glass',
        pap_cart: 'Paper',
        organic: 'Organic',
        container: 'Container',
        instalation: 'Instalation'
    },
    LineChart: {
        labelReal: 'Real Value',
        labelSimul: 'Simulated Value'
    },
    Bills: {
        from: 'From: ',
        to: 'To: ',
        formula: 'Calculation formula',
        formulaBody: 'Here will be presented the formula for calculating the amount to pay monthly!',
        ranges: ['Last 3 months', 'Last 6 months', 'Last 12 months'],
        defaultRange: {
            simulated: "Last month's simulated bill",
            real: "Last month's real bill"
        },
    },
    BillsChart: {
        labelReal: 'Real Value',
        labelSimul: 'Simulated Value',
        title: 'Real bill vs Simulated bill',
    },
    BillsTable: {
        title: 'Bills',
        from: 'From',
        to: 'To',
        value: 'Amount (€)',
        real: 'Real bill',
        simul: 'Simulated bill',
    },
    Alert: {
        title: 'Alert!'
    },
    Widget: {
        moreInfo: 'More info ',
        title: {
            bills: 'Bills',
            simulated: 'Simulated Bill - Details',
            real: 'Real Bill - Details',
            hour: "Users' Preferences - Details",
            day: "Users' Preferences - Details",
            week: "Users' Preferences - Details",
            month: "Users' Preferences - Details",
        }
    },
    BigWidget: {
        moreInfo: 'More info '
    },
    BigWidgetBusiness: {
        moreInfo: 'More info '
    },
    InfoBigBox: {
        mostCommon: 'Most used container'
    },
    ContainerKnobWidget: {
        moreInfo: 'More info ',
        wasteProduced: 'Quantity of waste produced on ',
        unit: 'L/day',
        regAvg: 'Region Average',
        rankBest: ' Very good',
        rankGood: ' Good',
        rankNormal: ' Medium',
        rankBad: ' Bad',
        rankWorst: ' Very bad',
        titleMore: 'Comparison Details'
    },
    KnobWidget: {
        unit: 'L/day'
    },
    LoginTable: {
        title: 'Login Attempts',
        searchPlaceholder: 'Search',
        user: 'User',
        type: 'Type',
        auth: 'Authentication',
        date: 'Date',
        approved: 'Approved',
        denied: 'Denied',
        role: {
            normal: 'Personal',
            county: 'County',
            admin: 'Administrator'
        }
    },
    ContainersTable: {
        title: "Containers' Usage",
        name: 'Container',
        usage: 'Usage (openings)',
        lastDay: 'Yesterday',
        lastWeek: 'Last 7 days',
        lastMonth: 'Last 30 days',
        lastSixMonths: 'Last 6 Months'
    },
    UsersTable: {
        modalTitle: 'Add User',
        title: 'Users',
        searchPlaceholder: 'Search',
        clear: 'Clear',
        username: 'Username',
        county: 'County',
        role: 'Role',
        last_access: 'Last access',
        status: 'Status',
        master: 'Master Key',
        checkMasterKey: 'Show Masterkey',
        actions: 'Actions',
        add: 'Add',
        btnDelete: 'Delete selected',
        tooltipText: 'click to edit'
    },
    UserForm: {
        username: 'Username',
        password: 'Password',
        cpassword: 'Confirm password',
        add: 'Add',
        role: 'Role',
        county: 'County',
        select: 'Select'
    },
    RolesTable: {
        modalTitle: 'Add Role',
        title: 'Roles',
        searchPlaceholder: 'Search',
        role: 'Role',
        nPermissions: 'Nr Permissions',
        nUsers: 'Nr Users',
        actions: 'Actions',
        add: 'Add',
        btnDelete: 'Delete selected',
        tooltipText: 'click to edit'
    },
    RoleForm: {
        add: 'Add',
        role: 'Role',
    },
    SBarChart: {
        title: 'Removal rate (%) ',
        indif: 'Mixed',
        plast: 'Plastic',
        glass: 'Glass',
        pap_cart: 'Paper',
        organic: 'Organic',
        containersRemoved: "Containers Collected",
        containersInstalled: "Containers Installed"
    },
    BarChart: {
        capacity: 'Capacity',
        month: 'Month',
        quantity: 'Quantity',
        type: 'Type',
        containers: 'Containers',
        waste: 'Waste',
        indif: 'Mixed',
        plast: 'Plastic',
        glass: 'Glass',
        pap_cart: 'Paper',
        organic: 'Organic',
        containersTitle: 'Number of containers',
        wasteTitle: 'Evolution of waste production by type of material collected',
    },
    MultiBarChart: {
        month: 'Month',
        quantity: 'Quantity',
        type: 'Type',
        waste: 'Waste',
        indif: 'Mixed',
        plast: 'Plastic',
        glass: 'Glass',
        pap_cart: 'Paper',
        organic: 'Organic',
        wasteTitle: 'Evolution of waste production by type of material collected',
    },
    DoughnutChart: {
        title: 'Recycle rate (%)',
        indif: 'Mixed',
        plast: 'Plastic',
        glass: 'Glass',
        pap_cart: 'Paper',
        organic: 'Organic',
    },
    SelfComparisons: {
        title: 'Waste produced on ',
        unit: ' L/day',
        regAvg: 'Region Average',
        actAvg: 'Activity Sector Average',
        selfAvgLabel: 'Personal',
        rankBest: ' Very low',
        rankGood: ' Low',
        rankNormal: ' Average',
        rankBad: ' High',
        rankWorst: ' Very high',
    },
    LoginBarChart: {
        title: 'Login Attempts',
        normal: 'Personal',
        county: 'County',
        admin: 'Administrator',
        approved: 'Approved',
        denied: 'Denied'
    },
    MonthChart: {
        label: 'Value',
    },
    WeekChart: {
        label: 'Value',
    },
    DayChart: {
        label: 'Value',
    },
    HourChart: {
        label: 'Value',
    },
    Details: {
        labelInt: '   Select range   ',
        detailsTextMonth: 'Monthly Evolution',
        detailsTextHour: 'Hourly Evolution',
        detailsTextDay: 'Daily Evolution',
        detailsTextWeek: 'Weekly Evolution',
        formula: 'Calculation formula',
        formulaBody: 'Here will be presented the formula for calculating the amount to pay monthly!',
        ranges: ['Last 3 months', 'Last 6 months', 'Last 12 months'],
        defaultRange: {
            simulated: "Last month's simulated bill",
            real: "Last month's real bill"
        },
        defaultText: {
            hour: "Preferred time to deposit waste",
            day: "Preferred day to deposit waste",
            week: "Week with most waste produced",
            month: "Month with most waste produced",
        },
        yLabel: {
            money: 'Value charged (€)',
            waste: 'Waste produced (L)'
        }
    },
    DetailsBusiness: {
        totalContainers: ' Total of Containers: ',
        lastPick: ' Last pick: ',
        indif: 'Mixed',
        plast: 'Plastic',
        glass: 'Glass',
        pap_cart: 'Paper'
    },
    HourTable: {
        hour: 'Hour',
        value: 'Value'
    },
    DayTable: {
        day: 'Day',
        month: 'Month',
        year: 'Year',
        value: 'Value'
    },
    WeekTable: {
        week: 'Week',
        month: 'Month',
        value: 'Value'
    },
    MonthTable: {
        month: 'Month',
        year: 'Year',
        value: 'Value'
    },
    CustomTabs: {
        tab1: 'Waste produced',
        tab2: 'Separation rate',
        ranges: ['Last 3 months', 'Last 6 months', 'Last 12 months'],
        labelInt: '   Select range   ',
        defaultInt: 'Last 3 months',
        unit: ' L/day',
        currentAvg: "Current month's average",
        historyAvg: 'History Average'
    },
    UploadContent: {
        notifications: {
            uploading: "File is uploading",
            processing: "File is being processed",
            processed: "File has been processed",
            invalid_format: "An error has occurred, please upload de file again",
        }
    },
    DropWidget: {
        uploadHint: 'Drop files here, or click to upload.',
        uploading: "File is uploading",
        title: {
            users: "Users' list upload",
            bills: "Bills' upload",
        },
    },
    ChangePassword: {
        title: 'Change password',
        currentPassword: 'Current password',
        newPassword: 'New password',
        newPasswordC: 'Confirmation new password',
        cpSuccess: 'Password changed successfully',
        cpErrorCurrentWrong: 'Current password is incorrect, please try again',
        cpErrorNewSameOld: 'New password and old are the same, please try again',
        cpErrorNotMatch: "New password and confirmation don't match, please try again",
        cpErrorLength: 'New password has less than 8 characters',
        cpErrorOther: 'An error has occured, please try again',
        btnC: 'Save'
    },
    ChangeInfo: {
        email: 'E-Mail',
        name: 'Name',
        ceSuccess: 'E-Mail changed successfully',
        ceErrorOther: 'An error has occured, please try again',
        ceErrorInvalid: 'Invalid e-mail, please try again',
        cnSuccess: 'Name changed successfully',
        cnErrorOther: 'An error has occured, please try again',
        cnErrorInvalid: 'Invalid name, please try again',
        btnC: 'Save'
    },
    LocationsTable: {
        title: "Address' list",
        searchPlaceholder: 'Search',
        alias: 'Name',
        address: 'Address',
        actions: 'Actions',
        btnDelete: 'Delete selected',
        tooltipText: 'click to edit'
    },
    SimulForm: {
        title: "Bill's simulator",
        indif: 'Mixed',
        plast: 'Plastic',
        glass: 'Glass',
        pap_cart: 'Paper',
        c140l: 'Containers of 140L',
        c240l: 'Containers of 240L',
        c340l: 'Containers of 340L',
        c1000l: 'Containers of 1000L',
        calc: 'Calculate'
    },
    CardForm: {
        card: 'Card',
        cardId: 'Card Nr',
        addCard: 'Add card',
        submit: 'Submit'
    },
    RangePicker: {
        labelInt: 'Select range',
    },
    EditProfile: {
        title: 'Edit Profile'
    },
    NoMessage: {
        text: 'No messages'
    },
    Main: {
        upLineChart: 'Evolution of waste production',
    },
    Global: {
        noData: 'No Data',
        status: {
            validated: 'Active',
            unvalidated: 'Inactive'
        }
    },
    Months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};