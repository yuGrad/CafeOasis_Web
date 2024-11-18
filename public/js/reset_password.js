const HOST_ADDR = "34.64.149.19:3000";

function sendEmailRandomUrl() {
	const email = document.getElementById("email").value;
	const name = document.getElementById("name").value;

	fetch(`http://${HOST_ADDR}/users/reset-password`, {
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

async function sendResetPassword() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	try {
		const response = await fetch(`http://${HOST_ADDR}/users/reset-password`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: email, password: password }), // 비구조화 할당 사용
		});

		if (response.ok) {
			alert("패스워드가 성공적으로 변경됐습니다.");
			window.location.replace(`http://${HOST_ADDR}/users/login`);
		} else {
			const data = await response.json();
			alert(data.message);
		}
	} catch (err) {
		alert("네트워크 오류, 다시 시도해보세요.");
	}
}
