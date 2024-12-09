import {
  AgeGroup,
  Education,
  Employment,
  Ethnicity,
  Persona,
  PoliticalMembership,
  PoliticalOrientation,
  Religion,
  Residence,
  Sex,
  SocialClass,
} from "../../types/Persona.js"
// Verteilung im Rahmen von WVS Germany Wave 7
export const personas_poll_dist_small: Array<Persona> = [
  {
    id: 1,
    demographics: {
      sex: Sex.Male,
      ageGroup: AgeGroup.MiddleAged,
      education: Education.Intermediate,
      socialClass: SocialClass.Middle,
      ethnicity: Ethnicity.German,
      religion: Religion.Christian,
      employment: Employment.SelfEmployed,
      residence: Residence.Urban,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Conservative,
      politicalMembership: PoliticalMembership.CDU,
    },
  },
  {
    id: 2,
    demographics: {
      sex: Sex.Female,
      ageGroup: AgeGroup.Adult,
      education: Education.Basic,
      socialClass: SocialClass.Lower,
      ethnicity: Ethnicity.German,
      religion: Religion.Christian,
      employment: Employment.Employed,
      residence: Residence.Urban,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Conservative,
      politicalMembership: PoliticalMembership.FDP,
    },
  },
  {
    id: 3,
    demographics: {
      sex: Sex.Female,
      ageGroup: AgeGroup.YoungAdult,
      education: Education.None,
      socialClass: SocialClass.Upper,
      ethnicity: Ethnicity.German,
      religion: Religion.Atheist,
      employment: Employment.Student,
      residence: Residence.Urban,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Progressive,
      politicalMembership: PoliticalMembership.TheGreens,
    },
  },
  {
    id: 4,
    demographics: {
      sex: Sex.Male,
      ageGroup: AgeGroup.Adult,
      education: Education.Higher,
      socialClass: SocialClass.Middle,
      ethnicity: Ethnicity.Immigrant,
      religion: Religion.Christian,
      employment: Employment.Employed,
      residence: Residence.Rural,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Conservative,
      politicalMembership: PoliticalMembership.TheGreens,
    },
  },
  {
    id: 5,
    demographics: {
      sex: Sex.Female,
      ageGroup: AgeGroup.Adult,
      education: Education.Higher,
      socialClass: SocialClass.Middle,
      ethnicity: Ethnicity.German,
      religion: Religion.Christian,
      employment: Employment.Unemployed,
      residence: Residence.Suburban,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Progressive,
      politicalMembership: PoliticalMembership.SPD,
    },
  },
  {
    id: 6,
    demographics: {
      sex: Sex.Male,
      ageGroup: AgeGroup.YoungAdult,
      education: Education.Intermediate,
      socialClass: SocialClass.Middle,
      ethnicity: Ethnicity.German,
      religion: Religion.Christian,
      employment: Employment.Employed,
      residence: Residence.Rural,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Progressive,
      politicalMembership: PoliticalMembership.CDU,
    },
  },
  {
    id: 7,
    demographics: {
      sex: Sex.Male,
      ageGroup: AgeGroup.Adult,
      education: Education.Basic,
      socialClass: SocialClass.Middle,
      ethnicity: Ethnicity.German,
      religion: Religion.Other,
      employment: Employment.Employed,
      residence: Residence.Suburban,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Liberal,
      politicalMembership: PoliticalMembership.SPD,
    },
  },
  {
    id: 8,
    demographics: {
      sex: Sex.Female,
      ageGroup: AgeGroup.MiddleAged,
      education: Education.Advanced,
      socialClass: SocialClass.Lower,
      ethnicity: Ethnicity.German,
      religion: Religion.Atheist,
      employment: Employment.Retired,
      residence: Residence.Urban,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Liberal,
      politicalMembership: PoliticalMembership.CDU,
    },
  },
  {
    id: 9,
    demographics: {
      sex: Sex.Female,
      ageGroup: AgeGroup.MiddleAged,
      education: Education.Basic,
      socialClass: SocialClass.Lower,
      ethnicity: Ethnicity.German,
      religion: Religion.Muslim,
      employment: Employment.Employed,
      residence: Residence.Urban,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Liberal,
      politicalMembership: PoliticalMembership.CDU,
    },
  },
  {
    id: 10,
    demographics: {
      sex: Sex.Male,
      ageGroup: AgeGroup.Senior,
      education: Education.Advanced,
      socialClass: SocialClass.Middle,
      ethnicity: Ethnicity.German,
      religion: Religion.Christian,
      employment: Employment.Retired,
      residence: Residence.Urban,
    },
    covariates: {
      politicalOrientation: PoliticalOrientation.Conservative,
      politicalMembership: PoliticalMembership.FDP,
    },
  },
]
