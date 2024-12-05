export enum Gender {
  Male,
  Female,
}
export enum Education {
  Primary,
  Lower_Secondary,
  Upper_Secondary,
  Undergratuate,
  Graduate,
}
export enum SocialClass {
  Upper,
  Middle,
  Lower,
}
export enum Race {
  White,
  African_Descent,
  Asian,
  Indigenous,
  Pacific_Islander,
  Hispanic,
}
export enum PoliticalMembership {
  CDU,
  SPD,
  TheGreens,
  FDP,
  AfD,
  DieLinke,
  BSW,
}
export enum Ideology {
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
export enum Age {
  to29,
  above30andto49,
  above50,
}
export type Persona = {
  id: string
  demographics: {
    age: Age
    sex: Gender
    education: Education
    social_class: SocialClass
    race: Race
  }
  covariates: {
    political_membership: PoliticalMembership
    ideology: Ideology
  }
}
