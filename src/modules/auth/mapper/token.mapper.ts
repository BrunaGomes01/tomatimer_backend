import { LoginReponseDto } from '../dto/login-response.dto';

export class TokenMapper {
  static toDto(token: string, refreshToken: string): LoginReponseDto {
    if (!token || !refreshToken) {
      return null;
    }

    return {
      token: token,
      refreshToken: refreshToken,
    };
  }
}
