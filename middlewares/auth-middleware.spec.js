const authMiddleware = require("./auth-middleware")

jest.mock("../models/user")//mocking해서 실행한듯 안한듯, 테스트 영역확장

const User = require("../models/user")

test("정상적인 토큰을 넣은 경우 User.findById가 실행된다.", () =>{
    User.findById = jest.fn();

    authMiddleware({
        headers: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0Iiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.jrhe_eoDL3TpHnadZU3x6tf3_iSssEeVFZcvushaOSg",
        },
    }, {
        status: () => ({
            send: () => {},
        }),
    locals: {},
    });

    expect(User.findById).toHaveBeenCalledTimes(1);//모킹한 함수가 한번이라도 실행이되었는지 감지하는 함수
    expect(User.findById).toHaveBeenCalledWith("test");
});

test("변조된 토큰으로 요청한 경우 로그인 후 사용하세요 라는 에러 메세지가 뜬다", () => {
    const mockedSend = jest.fn();

    authMiddleware({
        headers: {
            authorization: "Bearer ",
        },
    }, {
        status: () => ({
            send: mockedSend,
        }),
    locals: {},
    });

    expect(mockedSend).toHaveBeenCalledWith({
        errorMessage: "로그인 후 사용하세요"
    })
});