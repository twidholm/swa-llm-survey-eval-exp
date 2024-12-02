enum Gender {
  Male,
  Female,
}
enum Education {
  Primary,
  Lower_Secondary,
  Upper_Secondary,
  Undergratuate,
  Graduate,
}
enum SocialClass {
  Upper,
  Middle,
  Lower,
}
enum Race {
  White,
  African_Descent,
  Asian,
  Indigenous,
  Pacific_Islander,
  Hispanic,
}
enum PoliticalMembership {
  CDU,
  SPD,
  TheGreens,
  FDP,
  AfD,
  DieLinke,
  BSW,
}
enum Ideology {
  Liberalism,
  Conservatism,
  Socialism,
  Communism,
  Anarchism,
  Natioalism,
  Fascism,
  Environmentalism,
  Libertarianism,
  Populism,
  Religious,
  Centrism,
  Progressivism,
}

export type Persona = {
  id: string
  name: string
  demographics: {
    age: number
    gender: Gender
    education: Education
    social_class: SocialClass
    race: Race
  }
  covariates: {
    political_membership: PoliticalMembership
    ideology: Ideology
  }
}
