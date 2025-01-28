export class JWT {
  static get config() {
    return {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '90d' },
    };
  }
}
