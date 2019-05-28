// gr.js
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
        signOut: 'Αποσύνδεση'
    },
    Content: {
        controlPanel: 'Πίνακας ελέγχου',
        home: 'Αρχική'
    },
    NormalSideBar: {
        mainMenu: 'ΚΥΡΙΟ ΜΕΝΟΥ',
        containers: 'Containers',
        bills: 'Bills',
        settings: 'Ρυθμίσεις',
        usages: 'Nr of usages',
        help: 'Help'
    },
    NormalBusinessSideBar: {
        mainMenu: 'ΚΥΡΙΟ ΜΕΝΟΥ',
        simulText: "Bills' Simulator",
        settings: 'Ρυθμίσεις',
        help: 'Help'
    },
    AdminSideBar: {
        mainMenu: 'ΚΥΡΙΟ ΜΕΝΟΥ',
        general: 'Γενικά',
        userManagement: 'User Management',
        services: 'Services Management',
        policies: 'Policies Management',
        settings: 'Ρυθμίσεις',
        help: 'Help'
    },
    MunSideBar: {
        mainMenu: 'ΚΥΡΙΟ ΜΕΝΟΥ',
        generalStats: 'Γενικά στατιστικά',
        containers: 'Κάδοι απορριμμάτων',
        users: 'Producers',
        cards: 'Cards management',
        upload: 'File Upload',
        settings: 'Ρυθμίσεις',
        help: 'Help'
    },
    MunBusinessSideBar: {
        mainMenu: 'ΚΥΡΙΟ ΜΕΝΟΥ',
        generalStats: 'Γενικά στατιστικά',
        producers: 'Producers',
        upload: 'File Upload',
        settings: 'Ρυθμίσεις',
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
        gmapTitle: 'Θέση κάδων απορριμμάτων',
        markerName: 'Κάδος απορριμμάτων',
        totalReal: "Total of last month's real bill",
        totalSimul: "Total of last month's simulated bill",
        unit: ' €',
        lineChartTitle: 'Real value vs Simulated value'
    },
    TotalNormalBusiness: {
        gmapTitle: 'Θέση νοικοκυριών',
        markerName: 'Νοικοκυριό',
        totalReal: "Total of last month's real bill",
        totalSimul: "Total of last month's simulated bill",
        unit: ' €',
        lineChartTitle: 'Real value vs Simulated value'
    },
    NormalContent: {
        textChart: 'Εξέλιξη παραγωγής απορριμμάτων',
        dataLabel: 'Παραγωγή απορριμμάτων'
    },
    BusinessContent: {
        textLineChart: 'Εξέλιξη παραγωγής απορριμμάτων',
        dataLabel: 'Παραγωγή απορριμμάτων'
    },
    CountyNormalContent: {
        unit: ' €',
        activeUsers: 'Active Users',
        dayPref: 'Προτιμώμενη ημέρα χρήσης του κάδου',
        weekPref: "Εβδομάδα με τη μεγαλύτερη παραγωγή απορριμμάτων",
        monthPref: "Μήνας με τη μεγαλύτερη παραγωγή απορριμμάτων",
        totalReal: "Total of last month's real bill",
        totalSimul: "Total of last month's simulated bill",
        dataLabel: 'Παραγωγή απορριμμάτων',
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
        state: 'State',
        last_access: 'Last access',
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
        highProd: 'Υψηλότερη παραγωγή απορριμμάτων',
        lowProd: 'Χαμηλότερη παραγωγή απορριμμάτων',
        highSep: 'Higher separation rate',
        lowSep: 'Lower separation rate',
        totalReal: "Total of last month's real bill",
        totalSimul: "Total of last month's simulated bill",
    },
    ProducersContent: {
        markerName: 'Νοικοκυριό',
        gmapTitle: 'Θέση νοικοκυριών',
        map: 'Map',
        table: 'Table'
    },
    ContainersContent: {
        markerName: 'Κάδος απορριμμάτων',
        gmapTitle: 'Θέση κάδων απορριμμάτων',
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
        suffixTitle: ' - Δυναμικότητα εγκατεστημένων κάδων',
    },
    SimpleMap: {
        indif: 'Mixed',
        plast: 'Πλαστικό',
        glass: 'Glass',
        pap_cart: 'Χαρτί',
        organic: 'Organic',
        container: 'Κάδος απορριμμάτων',
        instalation: 'Νοικοκυριό'
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
        moreInfo: 'Περισσότερες πληροφορίες ',
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
        moreInfo: 'Περισσότερες πληροφορίες '
    },
    BigWidgetBusiness: {
        moreInfo: 'Περισσότερες πληροφορίες '
    },
    InfoBigBox: {
        mostCommon: 'Κάδος με τη συχνότερη χρήση'
    },
    ContainerKnobWidget: {
        moreInfo: 'Περισσότερες πληροφορίες ',
        wasteProduced: 'Quantity of waste produced on ',
        unit: 'L/ημέρα',
        regAvg: 'Μέσος όρος περιοχής',
        rankBest: ' Πολύ καλά',
        rankGood: ' Καλά',
        rankNormal: ' Μέτρια',
        rankBad: ' Άσχημα',
        rankWorst: ' Πολύ άσχημα',
        titleMore: 'Comparison Details'
    },
    KnobWidget: {
        unit: 'L/ημέρα'
    },
    LoginTable: {
        title: 'Login Attempts',
        searchPlaceholder: 'Αναζήτηση',
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
        searchPlaceholder: 'Αναζήτηση',
        clear: 'Clear',
        username: 'Username',
        county: 'County',
        role: 'Role',
        last_access: 'Last access',
        status: 'Status',
        master: 'Master Key',
        checkMasterKey: 'Show Masterkey',
        actions: 'Δράσεις',
        add: 'Add',
        btnDelete: 'Delete selected',
        tooltipText: 'Κάντε κλικ για επεξεργασία'
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
        searchPlaceholder: 'Αναζήτηση',
        role: 'Role',
        nPermissions: 'Nr Permissions',
        nUsers: 'Nr Users',
        actions: 'Δράσεις',
        add: 'Add',
        btnDelete: 'Delete selected',
        tooltipText: 'Κάντε κλικ για επεξεργασία'
    },
    RoleForm: {
        add: 'Add',
        role: 'Role',
    },
    SBarChart: {
        title: 'Ποσοστό εκτροπής (%) ',
        indif: 'Mixed',
        plast: 'Πλαστικό',
        glass: 'Γυαλί',
        pap_cart: 'Χαρτί',
        organic: 'Organic',
        containersRemoved: "Containers Collected",
        containersInstalled: 'Εγκατεστημένοι κάδοι'
    },
    BarChart: {
        capacity: 'Δυναμικότητα',
        month: 'Μήνας',
        quantity: 'Ποσότητα',
        type: 'Type',
        containers: 'Κάδοι απορριμμάτων',
        waste: 'Απορρίμματα',
        indif: 'Mixed',
        plast: 'Πλαστικό',
        glass: 'Γυαλί',
        pap_cart: 'Χαρτί',
        organic: 'Organic',
        containersTitle: 'Αριθμός κάδων',
        wasteTitle: 'Εξέλιξη παραγωγής απορριμμάτων ανά υλικό απορριμμάτων',
    },
    MultiBarChart: {
        month: 'Μήνας',
        quantity: 'Ποσότητα',
        type: 'Type',
        waste: 'Απορρίμματα',
        indif: 'Mixed',
        plast: 'Πλαστικό',
        glass: 'Γυαλί',
        pap_cart: 'Χαρτί',
        organic: 'Organic',
        wasteTitle: 'Εξέλιξη παραγωγής απορριμμάτων ανά υλικό απορριμμάτων',
    },
    DoughnutChart: {
        title: 'Recycle rate (%)',
        indif: 'Mixed',
        plast: 'Πλαστικό',
        glass: 'Γυαλί',
        pap_cart: 'Χαρτί',
        organic: 'Organic',
    },
    SelfComparisons: {
        title: 'Waste produced on ',
        unit: ' L/day',
        regAvg: 'Μέσος όρος περιοχής',
        actAvg: 'Activity Sector Average',
        selfAvgLabel: 'Personal',
        rankBest: ' Πολύ καλά',
        rankGood: ' Καλά',
        rankNormal: ' Μέτρια',
        rankBad: ' Άσχημα',
        rankWorst: ' Πολύ άσχημα',
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
        label: 'Τιμή',
    },
    WeekChart: {
        label: 'Τιμή',
    },
    DayChart: {
        label: 'Τιμή',
    },
    HourChart: {
        label: 'Τιμή',
    },
    Details: {
        labelInt: '   Επιλογή εύρους   ',
        detailsTextMonth: 'Μηνιαία εξέλιξη',
        detailsTextHour: 'Ωριαία εξέλιξη',
        detailsTextDay: 'Ημερήσια εξέλιξη',
        detailsTextWeek: 'Εβδομαδιαία εξέλιξη',
        formula: 'Calculation formula',
        formulaBody: 'Here will be presented the formula for calculating the amount to pay monthly!',
        ranges: ['Τελευταίο τρίμηνο', 'Τελευταίο εξάμηνο', 'Πέρυσι'],
        defaultRange: {
            simulated: "Last month's simulated bill",
            real: "Last month's real bill"
        },
        defaultText: {
            hour: 'Προτιμώμενη ώρα χρήσης του κάδου',
            day: 'Προτιμώμενη ημέρα χρήσης του κάδου',
            week: "Εβδομάδα με τη μεγαλύτερη παραγωγή απορριμμάτων",
            month: "Μήνας με τη μεγαλύτερη παραγωγή απορριμμάτων",
        },
        yLabel: {
            money: 'Τιμή χρέωσης (€)',
            waste: 'Απορρίμματα που παρήχθησαν (L)'
        }
    },
    DetailsBusiness: {
        totalContainers: ' Total of Containers: ',
        lastPick: ' Last pick: ',
        indif: 'Mixed',
        plast: 'Πλαστικό',
        glass: 'Γυαλί',
        pap_cart: 'Χαρτί'
    },
    HourTable: {
        hour: 'Ώρα',
        value: 'Τιμή'
    },
    DayTable: {
        day: 'Ημέρα',
        month: 'Μήνας',
        year: 'Χρόνος',
        value: 'Τιμή'
    },
    WeekTable: {
        week: 'Εβδομάδα',
        month: 'Μήνας',
        value: 'Τιμή'
    },
    MonthTable: {
        month: 'Μήνας',
        year: 'Χρόνος',
        value: 'Τιμή'
    },
    CustomTabs: {
        tab1: 'Παραγωγή απορριμμάτων',
        tab2: 'Separation rate',
        ranges: ['Τελευταίο τρίμηνο', 'Τελευταίο εξάμηνο', 'Πέρυσι'],
        labelInt: '   Επιλογή εύρους   ',
        defaultInt: 'Τελευταίο τρίμηνο',
        unit: ' L/day',
        currentAvg: 'Τρέχων μηνιαίος μέσος όρος',
        historyAvg: 'Μέσος όρος ιστορικού'
    },
    DropWidget: {
        uploadHint: 'Σύρετε αρχεία εδώ, ή κάντε κλικ για μεταφόρτωση. ',
        uploading: "File is uploading",
        title: {
            users: "Users' list upload",
            bills: "Bills' upload",
        },
    },
    UploadContent: {
        notifications: {
            uploading: "File is uploading",
            processing: "File is being processed",
            processed: "File has been processed",
            invalid_format: "An error has occurred, please upload de file again",
        }
    },
    ChangePassword: {
        title: 'Αλλαγή κωδικού πρόσβασης',
        currentPassword: 'Τρέχων κωδικός πρόσβασης',
        newPassword: 'Νέος κωδικός πρόσβασης',
        newPasswordC: 'Επιβεβαίωση κωδικού πρόσβασης',
        cpSuccess: 'Password changed successfully',
        cpErrorCurrentWrong: 'Current password is incorrect, please try again',
        cpErrorNewSameOld: 'New password and old are the same, please try again',
        cpErrorNotMatch: "New password and confirmation don't match, please try again",
        cpErrorLength: 'New password has less than 8 characters',
        cpErrorOther: 'An error has occured, please try again',
        btnC: 'Επιβεβαίωση'
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
        btnC: 'Guardar'
    },
    LocationsTable: {
        title: 'Λίστα διευθύνσεων',
        searchPlaceholder: 'Αναζήτηση',
        alias: 'Όνομα',
        address: 'Διεύθυνση',
        actions: 'Δράσεις',
        btnDelete: 'Delete selected',
        tooltipText: 'Κάντε κλικ για επεξεργασία'
    },
    SimulForm: {
        title: 'Προσομοίωση λογαριασμού',
        indif: 'Mixed',
        plast: 'Πλαστικό',
        glass: 'Γυαλί',
        pap_cart: 'Χαρτί',
        c140l: 'Κάδοι των 140L',
        c240l: 'Κάδοι των 240L',
        c340l: 'Κάδοι των 340L',
        c1000l: 'Κάδοι των 1000L',
        calc: 'Υπολογισμός'
    },
    CardForm: {
        card: 'Card',
        cardId: 'Card Nr',
        addCard: 'Add card',
        submit: 'Submit'
    },
    RangePicker: {
        labelInt: 'Επιλογή εύρους',
    },
    EditProfile: {
        title: 'Edit Profile'
    },
    NoMessage: {
        text: 'No messages'
    },
    Main: {
        upLineChart: 'Εξέλιξη παραγωγής απορριμμάτων',
    },
    Global: {
        noData: 'No Data',
        status: {
            validated: 'Active',
            unvalidated: 'Inactive'
        }
    },
    Months: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάϊος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος']
};