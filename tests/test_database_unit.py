# tests/test_database_unit.py
import os
import json
from backend.database import save_json, load_json

def test_save_and_load_json(tmp_path):
    test_data = {"a": 1, "b": 2}
    file_path = tmp_path / "test.json"

    save_json(str(file_path), test_data)
    loaded = load_json(str(file_path))

    assert loaded == test_data
    assert os.path.exists(file_path)