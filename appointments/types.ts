export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDateTime: string;
};

export type Query = {
  __typename?: 'Query';
  getAppointments: Array<Maybe<Appointment>>;
};


export type QueryGetAppointmentsArgs = {
  fromDateTime: InputMaybe<Scalars['AWSDateTime']>;
  specialisms: InputMaybe<Array<Specialism>>;
  toDateTime: InputMaybe<Scalars['AWSDateTime']>;
  type: InputMaybe<Type>;
};

export enum Specialism {
  Addiction = 'addiction',
  Adhd = 'ADHD',
  Cbt = 'CBT',
  Divorce = 'divorce',
  Sexuality = 'sexuality'
}

export enum Type {
  Consultation = 'consultation',
  Oneoff = 'oneoff'
}

export type Appointment = {
  __typename?: 'Appointment';
  duration: Scalars['Int'];
  startDateTime: Scalars['AWSDateTime'];
  therapistName: Scalars['String'];
  type: Type;
};
