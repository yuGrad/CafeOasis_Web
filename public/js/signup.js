const HOST_ADDR = "localhost:8080";

function openModal() {
	document.getElementById("emailModal").classList.remove("hidden");
}

function closeModal(event) {
	if (event.target.id === "emailModal" || event.target.id === "submitBtn") {
		document.getElementById("emailModal").classList.add("hidden");
	}
}

function sendEmailRequest() {
	const email = document.getElementById("email").value;
	fetch(`http://${HOST_ADDR}/email/signup/request`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email: email }),
	})
		.then((response) => {
			if (response.ok) alert("이메일로 인증번호가 전송되었습니다.");
			else alert("이메일 인증 오류: 500 error");
		})
		.catch((error) => {
			alert(`이메일 인증 오류: ${error.message}`);
		});
}

async function sendEmailVerification(event) {
	const email = document.getElementById("email").value;
	const user_code = document.getElementById("user_code").value;

	try {
		const response = await fetch(
			`http://${HOST_ADDR}/email/signup/verification`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email, user_code: user_code }),
			}
		);

		if (response.ok) {
			alert("이메일 인증 코드 일치");
			closeModal(event);
		} else {
			alert("이메일 인증 코드 불일치");
		}
	} catch (err) {
		alert(`이메일 인증 오류: ${error.message}`);
	}
}

document.addEventListener("DOMContentLoaded", function () {
	const userTypeRadios = document.getElementsByName("user_type");
	const customerSection = document.getElementById("customerSection");
	const additionalField = document.getElementById("additional_field");

	function togglecustomerSection() {
		const isCustomerSelected = document.getElementById("customer").checked;
		if (isCustomerSelected) {
			customerSection.classList.remove("hidden");
			additionalField.classList.add("hidden");
		} else {
			customerSection.classList.add("hidden");
			additionalField.classList.remove("hidden");
		}
	}

	userTypeRadios.forEach((radio) => {
		radio.addEventListener("change", togglecustomerSection);
	});
	togglecustomerSection(); // 초기 로드 시 섹션 상태 업데이트
});

document
	.getElementById("openEmailModalBtn")
	.addEventListener("click", function () {
		openModal();
		sendEmailRequest();
	});
