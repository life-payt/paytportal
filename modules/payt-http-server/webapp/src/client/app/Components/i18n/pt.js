// pt.js
export default {
    General: {
        Login: {
            invalidCredentials: 'Credenciais inválidas',
            temporarilySuspended: 'Conta de utilizador bloqueada por ',
            accountBlocked: 'Conta de utilizador bloqueada permanentemente, por favor contacte a administração',
            signin: ' Entrar',
            username: 'Nome de Utilizador',
            password: 'Palavra-Passe',
            rememberme: 'Lembrar-me',
            resetPassword: 'Repor palavra-passe',
        },
        Signup: {
            requiredFields: 'Campos obrigatórios',
            cpErrorNotMatch: 'Palavra-passe e confirmação não coincidem',
            cpErrorLength: 'Palavra-passe tem menos de 8 caracteres',
            signup: ' Registar',
            infoText: 'Está a efetuar o login pela primeira vez, por favor indique o seu e-mail e altere a palavra-passe antes de continuar.',
            password: 'Palavra-Passe',
            cpassword: 'Confirmar Palavra-Passe',
            submit: 'Confirmar',
        },
        ResetPassword: {
            rpError: 'Chave-mestra incorrecta, por favor tente novamente',
            title: 'Repor palavra-passe',
            infoText: 'Para repor a palavra-passe por favor indique o seu número de cliente e a chave-mestra indicada no cartão que recebeu quando aderiu ao projeto. Em caso de sucesso a sua palavra-passe irá passar a ser essa mesma chave que depois pode alterar a qualquer momento.',
            username: 'Número de cliente',
            masterkey: 'Chave-mestra',
            submit: 'Confirmar',
        },
        Main: {
            stats: 'Indicadores',
            nrUsers: "Número de utilizadores",
            nrContainers: "Contentores instalados",
            nrCounties: "Municípios pertencentes",
            totalWaste: "Total de resíduos recolhidos",
            avgMonthWaste: "Média mensal de resíduos produzidos",
        },
        Logo: {
            signin: ' Entrar na Área do Cliente ',
        },
        Footer: {
            partners: 'Parceiros',
        },
    },
    Header: {
        signOut: 'Sair'
    },
    Content: {
        controlPanel: 'Painel de Controlo',
        home: 'Início'
    },
    NormalSideBar: {
        mainMenu: 'MENU PRINCIPAL',
        containers: 'Contentores',
        bills: 'Faturas',
        settings: 'Definições',
        usages: 'Nº de Utilizações',
        help: 'Ajuda'
    },
    NormalBusinessSideBar: {
        mainMenu: 'MENU PRINCIPAL',
        simulText: 'Simulador de Tarifário',
        settings: 'Definições',
        help: 'Ajuda'
    },
    AdminSideBar: {
        mainMenu: 'MENU PRINCIPAL',
        general: 'Geral',
        userManagement: 'Gestão de Utilizadores',
        services: 'Gestão de Serviços',
        policies: 'Gestão de Políticas',
        settings: 'Definições',
        help: 'Ajuda'
    },
    MunSideBar: {
        mainMenu: 'MENU PRINCIPAL',
        generalStats: 'Estatisticas Gerais',
        containers: 'Contentores',
        users: 'Produtores',
        cards: 'Gestão de cartões',
        upload: 'Enviar ficheiros',
        settings: 'Definições',
        help: 'Ajuda'
    },
    MunBusinessSideBar: {
        mainMenu: 'MENU PRINCIPAL',
        generalStats: 'Estatisticas Gerais',
        producers: 'Produtores',
        upload: 'Enviar ficheiros',
        settings: 'Definições',
        help: 'Ajuda'
    },
    RowAddress: {
        realTitle: 'Tarifa real do último mês',
        simulTitle: 'Tarifa simulada do último mês',
        labelKnob: 'Pessoal',
        unit: ' €',
        errorMsg: 'Sem Dados'
    },
    RowAddressBusiness: {
        realTitle: 'Tarifa real do último mês',
        simulTitle: 'Tarifa simulada do último mês',
        labelKnob: 'Pessoal',
        unit: ' €',
        errorMsg: 'Sem Dados'
    },
    ContainersNormal: {
        gmapTitle: 'Localização dos Contentores',
        markerName: 'Contentor',
        totalReal: 'Total tarifa real do último mês',
        totalSimul: 'Total tarifa simulada do último mês',
        unit: ' €',
        lineChartTitle: 'Relação entre valor real e simulado'
    },
    TotalNormalBusiness: {
        gmapTitle: 'Localização das Instalações',
        markerName: 'Instalação',
        totalReal: 'Total tarifa real do último mês',
        totalSimul: 'Total tarifa simulada do último mês',
        unit: ' €',
        lineChartTitle: 'Relação entre valor real e simulado'
    },
    NormalContent: {
        textChart: 'Evolução da produção de residuos',
        dataLabel: 'Resíduos produzidos'
    },
    BusinessContent: {
        textLineChart: 'Evolução da produção de residuos',
        dataLabel: 'Resíduos produzidos',
    },
    CountyNormalContent: {
        unit: ' €',
        activeUsers: "Utilizadores activos",
        dayPref: "Dia com maior produção de resíduos",
        weekPref: "Semana com maior produção de resíduos",
        monthPref: "Mês com maior produção de resíduos nos últimos 12 meses",
        totalReal: 'Total tarifa real do último mês',
        totalSimul: 'Total tarifa simulada do último mês',
        dataLabel: 'Resíduos produzidos',
        barTitle: 'Evolução da produção de resíduos',
        errorMsg: 'Sem Dados'
    },
    Users: {
        title: 'Lista de Produtores',
        searchPlaceholder: 'Procurar',
        clear: 'Limpar',
        name: 'Nome',
        mail: 'E-mail',
        address: 'Morada',
        cards: 'Cartões associados',
        last_access: 'Último acesso',
        state: 'Estado',
        actions: 'Acções',
        checkCards: 'Gerir cartões',
        modalTitle: 'Cartões Associados',
    },
    Cards: {
        addCardModalTitle: 'Adicionar cartão',
        btnDelete: 'Remover selecionados',
        showOwner: 'Mostrar utilizador associado',
        noOwner: 'Nenhum utilizador associado',
        showOwnerModalTitle: 'Utilizador Associado',
        title: 'Lista de cartões',
        nrCard: 'Nº do cartão',
        cardOwner: 'Utilizador Associado'
    },
    HistoryCardTable: {
        message: 'Descrição',
        producer: 'Produtor',
        timestamp: 'Data',
    },
    OwnerProfileCard: {
        name: 'Nome',
        address: 'Morada',
        city: 'Cidade',
        zipcode: 'Código postal',
    },
    IDCardForm: {
        cardId: 'ID do cartão',
        card: 'Cartão',
        submit: 'Confirmar'
    },
    CountyBusinessContent: {
        unit: ' €',
        highProd: 'Maior produção total de RU',
        lowProd: 'Menor produção total de RU',
        highSep: 'Maior taxa de separação',
        lowSep: 'Menor taxa de separação',
        totalReal: 'Total tarifa real do último mês',
        totalSimul: 'Total tarifa simulada do último mês',
    },
    ProducersContent: {
        markerName: 'Instalação',
        gmapTitle: 'Localização das Instalações',
        map: 'Mapa',
        table: 'Tabela'
    },
    ContainersContent: {
        markerName: 'Contentor',
        gmapTitle: 'Localização dos Contentores',
    },
    ContainerLineChart: {
        label: 'Aberturas',
        title: "Utilização do contentor ",
    },
    ContainerTabs: {
        title: "Localização das Instalações",
    },
    BoxHeader: {
        prefixTitle: 'Instalação ',
        suffixTitle: ' - Capacidade instalada',
    },
    SimpleMap: {
        indif: 'Indiferenciados',
        plast: 'Plástico',
        glass: 'Vidro',
        pap_cart: 'Papel/Cartão',
        organic: 'Orgânico',
        container: 'Contentor',
        instalation: 'Instalação'
    },
    LineChart: {
        labelReal: 'Valor Real',
        labelSimul: 'Valor Simulado'
    },
    Bills: {
        from: 'De: ',
        to: 'Até: ',
        formula: 'Fórmula de Cálculo',
        formulaBody: 'Aqui será apresentada a fórmula do cálculo do valor a pagar mensalmente!',
        ranges: ['Últimos 3 meses', 'Últimos 6 meses', 'Últimos 12 meses'],
        defaultRange: {
            simulated: "Tarifa simulada do último mês",
            real: "Tarifa real do último mês",
        },
    },
    BillsChart: {
        labelReal: 'Valor Real',
        labelSimul: 'Valor Simulado',
        title: 'Fatura real vs Fatura simulada',
    },
    BillsTable: {
        title: 'Faturas',
        from: 'De',
        to: 'Até',
        value: 'Quantia (€)',
        real: 'Fatura real',
        simul: 'Fatura simulada',
    },
    Alert: {
        title: 'Alerta!'
    },
    Widget: {
        moreInfo: 'Mais informações ',
        title: {
            bills: 'Faturas',
            simulated: 'Tarifa Simulada - Detalhes',
            real: 'Tarifa Real - Detalhes',
            hour: 'Detalhes Horários',
            day: 'Detalhes Diários',
            week: 'Detalhes Semanais',
            month: 'Detalhes Mensais',
        }
    },
    BigWidget: {
        moreInfo: 'Mais informações '
    },
    BigWidgetBusiness: {
        moreInfo: 'Mais informações '
    },
    InfoBigBox: {
        mostCommon: 'Contentores mais utilizados'
    },
    ContainerKnobWidget: {
        moreInfo: 'Mais informações ',
        wasteProduced: 'Quantidade de resíduos produzidos em ',
        unit: 'L/dia',
        regAvg: 'Média Região',
        rankBest: ' Muito baixa',
        rankGood: ' Baixa',
        rankNormal: ' Média',
        rankBad: ' Elevada',
        rankWorst: ' Muito elevada',
        titleMore: 'Comparações - Detalhes'
    },
    KnobWidget: {
        unit: 'L/dia'
    },
    LoginTable: {
        title: 'Tentativas de Login',
        searchPlaceholder: 'Procurar',
        user: 'Utilizador',
        type: 'Tipo',
        auth: 'Autenticação',
        date: 'Data',
        approved: 'Aprovado',
        denied: 'Recusado',
        role: {
            normal: 'Pessoal',
            county: 'Municipio',
            admin: 'Administrador'
        }
    },
    ContainersTable: {
        title: "Utilização dos Contentores",
        name: 'Contentor',
        usage: 'Utilização (aberturas)',
        lastDay: 'Ontem',
        lastWeek: 'Últimos 7 dias',
        lastMonth: 'Últimos 30 dias',
        lastSixMonths: 'Últimos 6 meses'
    },
    UsersTable: {
        modalTitle: 'Adicionar Utilizador',
        title: 'Utilizadores',
        searchPlaceholder: 'Procurar',
        clear: 'Limpar',
        username: 'Utilizador',
        actions: 'Acções',
        role: 'Cargo',
        last_access: 'Último acesso',
        county: 'Município',
        status: 'Estado',
        master: 'Master Key',
        checkMasterKey: 'Mostrar Masterkey',
        add: 'Adicionar',
        btnDelete: 'Remover selecionados',
        tooltipText: 'clique para editar'
    },
    UserForm: {
        username: 'Nome de Utilizador',
        password: 'Palavra-Passe',
        cpassword: 'Confirmar palavra-passe',
        add: 'Adicionar',
        role: 'Cargo',
        county: 'Município',
        select: 'Selecionar'
    },
    RolesTable: {
        modalTitle: 'Adicionar Cargo',
        title: 'Cargos',
        searchPlaceholder: 'Procurar',
        role: 'Cargo',
        nPermissions: 'Nº Permissões',
        nUsers: 'Nº Utilizadores',
        actions: 'Acções',
        add: 'Adicionar',
        btnDelete: 'Remover selecionados',
        tooltipText: 'clique para editar'
    },
    RoleForm: {
        add: 'Adicionar',
        role: 'Cargo',
    },
    ServicesTable: {
        modalTitle: 'Adicionar Serviço',
        title: 'Serviços',
        searchPlaceholder: 'Procurar',
        clear: 'Limpar',
        name: 'Nome',
        actions: 'Acções',
        start: 'Iniciar',
        stop: 'Parar',
        remove: 'Remover',
        key: 'Chave',
        started: 'Iniciado',
        stopped: 'Parado',
        status: 'Estado',
        add: 'Adicionar',
    },
    ServiceForm: {
        name: 'Nome',
        key: 'Chave',
        submit: 'Confirmar'
    },
    AdminPolicies: {
        noFilter: 'Todos',
        filter: 'Filtro: '
    },
    PoliciesTable: {
        title: 'Políticas',
        searchPlaceholder: 'Procurar',
        clear: 'Limpar',
        field: 'Campo',
        policy: 'Política',
    },
    PermissionsTable: {
        title: 'Permissões',
        searchPlaceholder: 'Procurar',
        clear: 'Limpar',
        function: 'Função',
        permission: 'Permissão',
        operation: 'Operação',
    },
    SBarChart: {
        title: 'Taxa de apresentação à remoção (%)',
        indif: 'Indiferenciados',
        plast: 'Plástico',
        glass: 'Vidro',
        pap_cart: 'Papel/Cartão',
        organic: 'Orgânico',
        containersRemoved: "Contentores apresentados",
        containersInstalled: "Contentores instalados"
    },
    BarChart: {
        capacity: 'Capacidade',
        month: 'Mês',
        quantity: 'Quantidade',
        type: 'Tipo',
        containers: 'Contentores',
        waste: 'Resíduos',
        indif: 'Indiferenciados',
        plast: 'Plástico',
        glass: 'Vidro',
        pap_cart: 'Papel/Cartão',
        organic: 'Orgânico',
        containersTitle: 'Número de contentores',
        wasteTitle: 'Evolução da produção de resíduos por tipo de material recolhido',
    },
    MultiBarChart: {
        month: 'Mês',
        quantity: 'Quantidade',
        type: 'Tipo',
        waste: 'Resíduos',
        indif: 'Indiferenciados',
        plast: 'Plástico',
        glass: 'Vidro',
        pap_cart: 'Papel/Cartão',
        organic: 'Orgânico',
        wasteTitle: 'Evolução da produção de resíduos por tipo de material recolhido',
    },
    DoughnutChart: {
        title: 'Taxa de separação (%)',
        indif: 'Indiferenciados',
        plast: 'Plástico',
        glass: 'Vidro',
        pap_cart: 'Papel/Cartão',
        organic: 'Orgânico',
    },
    SelfComparisons: {
        title: 'Resíduos produzidos em ',
        unit: ' L/dia',
        regAvg: 'Média Região',
        actAvg: 'Média Setor de Atividade',
        selfAvgLabel: 'Pessoal',
        rankBest: ' Muito bom',
        rankGood: ' Bom',
        rankNormal: ' Razoável',
        rankBad: ' Mau',
        rankWorst: ' Muito mau',
    },
    LoginBarChart: {
        title: 'Tentativas de Logins',
        normal: 'Pessoal',
        county: 'Municipio',
        admin: 'Administrador',
        approved: 'Aprovado',
        denied: 'Recusado'
    },
    MonthChart: {
        label: 'Valor',
    },
    WeekChart: {
        label: 'Valor',
    },
    DayChart: {
        label: 'Valor',
    },
    HourChart: {
        label: 'Valor',
    },
    Details: {
        labelInt: '   Defina um intervalo   ',
        detailsTextMonth: 'Evolução Mensal',
        detailsTextHour: 'Evolução Horária',
        detailsTextDay: 'Evolução Diária',
        detailsTextWeek: 'Evolução Semanal',
        formula: 'Fórmula de Cálculo',
        formulaBody: 'Aqui será apresentada a fórmula do cálculo do valor a pagar mensalmente!',
        ranges: ['Últimos 3 meses', 'Últimos 6 meses', 'Últimos 12 meses'],
        defaultRange: {
            simulated: "Tarifa simulada do último mês",
            real: "Tarifa real do último mês",
        },
        defaultText: {
            hour: "Horário preferencial deposição de resíduos",
            day: "Dia preferencial deposição de resíduos",
            week: "Semana com maior produção de resíduos",
            month: "Mês com maior produção de resíduos",
        },
        yLabel: {
            money: 'Valor cobrado (€)',
            waste: 'Resíduos produzidos (L)'
        }
    },
    DetailsBusiness: {
        totalContainers: ' Total de Contentores: ',
        lastPick: ' Última recolha: ',
        indif: 'Indiferenciados',
        plast: 'Plástico',
        glass: 'Vidro',
        pap_cart: 'Papel/Cartão'
    },
    HourTable: {
        hour: 'Hora',
        value: 'Valor'
    },
    DayTable: {
        day: 'Dia',
        month: 'Mês',
        year: 'Ano',
        value: 'Valor'
    },
    WeekTable: {
        week: 'Semana',
        month: 'Mês',
        value: 'Valor'
    },
    MonthTable: {
        month: 'Mês',
        year: 'Ano',
        value: 'Valor'
    },
    CustomTabs: {
        tab1: 'Resíduos produzidos',
        tab2: 'Taxa de separação',
        ranges: ['Últimos 3 meses', 'Últimos 6 meses', 'Últimos 12 meses'],
        labelInt: '   Defina um intervalo de comparação   ',
        defaultInt: 'Últimos 3 meses',
        unit: ' L/dia',
        currentAvg: 'Média Mês Atual',
        historyAvg: 'Média Histórico'
    },
    DropWidget: {
        uploadHint: 'Arraste os ficheiros, ou clique para seleccionar.',
        uploading: "O ficheiro está a ser carregado",
        title: {
            users: 'Envio de lista de utilizadores',
            bills: 'Envio de faturas',
        },
    },
    UploadContent: {
        notifications: {
            uploading: "O ficheiro está a ser carregado",
            processing: "O ficheiro está a ser processado",
            processed: "O ficheiro acabou de ser processado",
            invalid_format: "Ocorreu um erro, volte a enviar o ficheiro"
        }
    },
    ChangePassword: {
        title: 'Alterar palavra-passe',
        currentPassword: 'Palavra-passe atual',
        newPassword: 'Nova palavra-passe',
        newPasswordC: 'Confirmar nova palavra-passe',
        cpSuccess: 'Palavra-passe alterada com sucesso',
        cpErrorCurrentWrong: 'Palavra-passe atual está incorreta, por favor tente novamente',
        cpErrorNewSameOld: 'Nova palavra-passe e atual são iguais, por favor tente novamente',
        cpErrorNotMatch: 'Nova palavra-passe e confirmação não são iguais, por favor tente novamente',
        cpErrorLength: 'Nova palavra-passe tem menos de 8 caracteres',
        cpErrorOther: 'Ocorreu um erro, por favor tente novamente',
        btnC: 'Guardar'
    },
    ChangeInfo: {
        email: 'E-Mail',
        name: 'Nome',
        ceSuccess: 'E-Mail alterado com sucesso',
        ceErrorOther: 'Ocorreu um erro, por favor tente novamente',
        ceErrorInvalid: 'E-mail inválido, por favor tente novamente',
        cnSuccess: 'Nome alterado com sucesso',
        cnErrorOther: 'Ocorreu um erro, por favor tente novamente',
        cnErrorInvalid: 'Nome inválido, por favor tente novamente',
        btnC: 'Guardar'
    },
    LocationsTable: {
        title: 'Lista de moradas',
        searchPlaceholder: 'Procurar',
        alias: 'Nome',
        address: 'Morada',
        actions: 'Acções',
        btnDelete: 'Remover selecionados',
        tooltipText: 'clique para editar'
    },
    SimulForm: {
        title: 'Simulador de Tarifário',
        indif: 'Indiferenciados',
        plast: 'Plástico',
        glass: 'Vidro',
        pap_cart: 'Papel/Cartão',
        c140l: 'Contentores de 140L',
        c240l: 'Contentores de 240L',
        c340l: 'Contentores de 340L',
        c1000l: 'Contentores de 1000L',
        calc: 'Calcular'
    },
    CardForm: {
        card: 'Cartão',
        cardId: 'Número do cartão',
        addCard: 'Adicionar cartão',
        submit: 'Confirmar'
    },
    RangePicker: {
        labelInt: 'Defina um intervalo'
    },
    EditProfile: {
        title: 'Editar Perfil'
    },
    NoMessage: {
        text: 'Sem mensagens'
    },
    Main: {
        upLineChart: 'Evolução da produção de residuos',
    },
    Global: {
        noData: 'Sem dados',
        status: {
            validated: 'Ativo',
            unvalidated: 'Inativo'
        }
    },
    Months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
};