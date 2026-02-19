import pypdf
import io
import re


def extract_text_from_pdf(file_bytes):
    """
    PDF file ke bytes se text nikalta hai
    file_bytes: uploaded file ka raw data
    """
    text = ""

    try:
        # BytesIO se PDF reader banao
        pdf_reader = pypdf.PdfReader(io.BytesIO(file_bytes))

        # Har page ka text nikalo
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"

    except Exception as e:
        print(f"PDF padhne mein error: {e}")
        return ""

    # Clean karo — extra spaces hatao
    text = re.sub(r"\s+", " ", text).strip()

    return text
