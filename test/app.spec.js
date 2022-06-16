const app = require("../app")
const request = require('supertest')

describe("유저 페이지 테스트코드", () => {
    test("회원가입 내용이 중복되면 Status Code 201반환", async () => {
        const response = await request(app).post("/api/user/signup").send({
            email: "test@domain.com",
            nickName: "test",
            password: "test123!",
            repeat_password: "test123!"
        });
        expect(response.statusCode).toBe(400);
    });
});