import { Photo } from './photo';

export interface User {
  // include properties we are getting from UserForListDto
  id: number;
  username: string;
  knownAs: string;
  age: number;
  gender: string;
  created: Date;
  lastActive: Date;
  photoUrl: string;
  city: string;
  country: string;

  // include properties we are getting from UserForDetailDto
  // setting the optional with "?"
  // optional properties always come after the required properties
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
}
