function sendEmailRandomUrl() {
  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;

  fetch("http://localhost:3000/users/reset-password", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, name: name }),
  })
    .then((response) => {
      if (response.ok) alert("이메일로 Url 전송되었습니다.");
      else alert("서버내 오류: 500 error");
    })
    .catch((error) => {
      alert(`이메일 전송 실패: ${error.message}`);
    });
}
