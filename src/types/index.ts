export interface IVoter {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  voterId: string;
  registrationPhoto: string;
  idDocument: string;
  hasVoted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICandidate {
  _id: string;
  name: string;
  party: string;
  photo: string;
  description: string;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVote {
  _id: string;
  voterId: string;
  candidateId: string;
  votingPhoto: string;
  createdAt: Date;
}

export interface IAdmin {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  voterId: string;
  iat?: number;
  exp?: number;
} 