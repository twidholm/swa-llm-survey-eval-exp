//demographics
export enum Education {
  None = "Kein Abschluss",
  Basic = "Hauptschulabschluss",
  Intermediate = "Realschulabschluss",
  Advanced = "Abitur/Fachhochschulreife",
  Higher = "Hochschulabschluss",
}
export enum Education_2 {
  Primary = "Primary",
  Lower_Secondary = "Lower Secondary",
  Upper_Secondary = "Upper Secondary",
  Undergraduate = "Undergraduate",
  Graduate = "Graduate",
}
export enum Ethnicity {
  German = "Deutscher Hintergrund",
  Immigrant = "Migrationshintergrund",
}

export enum Ethnicity_2 {
  White = "Weiß",
  African_Descent = "Schwarz",
  Asian = "Asiatisch",
  Indigenous = "Indigen",
  Pacific_Islander = "Polynesiesch",
  Hispanic = "Lateinamerikanisch",
}

export enum Sex {
  Male = "Männlich",
  Female = "Weiblich",
}

export enum AgeGroup {
  YoungAdult = "18–29 Jahre",
  Adult = "30–49 Jahre",
  MiddleAged = "50–69 Jahre",
  Senior = "70 Jahre und älter",
}

export enum SocialClass {
  Upper = "Obere Klasse",
  Middle = "Mittlere Klasse",
  Lower = "Untere Klasse",
}

export enum Religion {
  Christian = "Christ",
  Muslim = "Muslim",
  Atheist = "Atheist",
  Other = "Andere Religion",
}

export enum Employment {
  Employed = "Angestellt",
  SelfEmployed = "Selbstständig",
  Unemployed = "Arbeitslos",
  Retired = "Rentner",
  Student = "Student",
}

export enum Residence {
  Urban = "Stadt",
  Suburban = "Vorstadt",
  Rural = "Ländliche Region",
}
//covariates
export enum PoliticalMembership {
  CDU = "CDU",
  SPD = "SPD",
  TheGreens = "Bündnis 90/ Die Grünen",
  FDP = "FDP",
  AfD = "AfD",
  DieLinke = "Die Linke",
  BSW = "BSW",
}
export enum Ideology {
  Liberalism = "Liberal",
  Conservatism = "Konservativ",
  Socialism = "Sozialistisch",
  Communism = "Kommunistisch",
  Anarchism = "Anarchistisch",
  Natioalism = "Nationalist",
  Fascism = "Faschistisch",
  Environmentalism = "Umweltschützer",
  Libertarianism = "Libertarist",
  Populism = "Populist",
  Religious = "Religiös",
  Centrism = "Zentrist",
  Progressivism = "Progressivist",
}
export enum PoliticalOrientation {
  Liberal = "Liberal",
  Conservative = "Konservativ",
  Progressive = "Progressiv",
}

//Persona Types
export type Persona = {
  id: number
  demographics: {
    sex: Sex
    ageGroup: AgeGroup
    education: Education
    socialClass: SocialClass
    ethnicity: Ethnicity
    religion: Religion
    employment: Employment
    residence: Residence
  }
  covariates: {
    politicalOrientation: PoliticalOrientation
    politicalMembership: PoliticalMembership
  }
}
