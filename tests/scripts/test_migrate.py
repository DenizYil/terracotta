import pytest
from click.testing import CliRunner


def parse_version(verstr):
    """Convert 'v<major>.<minor>.<patch>' to (major, minor, patch)"""
    components = verstr.split(".")
    components[0] = components[0].lstrip("v")
    return tuple(int(c) for c in components[:3])


def test_migrate(v07_db, monkeypatch, force_reload):
    """Test database migration to this major version."""
    import terracotta
    from terracotta import get_driver
    from terracotta.scripts import cli

    current_version = parse_version(terracotta.__version__)

    # run migration
    runner = CliRunner()
    result = runner.invoke(
        cli.cli,
        [
            "migrate",
            str(v07_db),
            "--from",
            "v0.7",
            "--to",
            f"v{current_version[0]}.{current_version[1]}",
            "--yes",
        ],
    )

    assert result.exit_code == 0
    assert "Upgrade path found" in result.output

    driver_updated = get_driver(str(v07_db), provider="sqlite")

    # key_names did not exist in v0.7
    assert driver_updated.key_names == ("key1", "akey", "key2")


def test_migrate_next(v07_db, monkeypatch, force_reload):
    """Test database migration to next major version if one is available."""
    with monkeypatch.context() as m:
        # pretend we are at the next major version
        import terracotta

        current_version = parse_version(terracotta.__version__)
        next_major_version = (current_version[0], current_version[1] + 1, 0)
        m.setattr(terracotta, "__version__", ".".join(map(str, next_major_version)))

        from terracotta import get_driver
        from terracotta.scripts import cli
        from terracotta.migrations import MIGRATIONS

        if next_major_version[:2] not in [m.up_version for m in MIGRATIONS.values()]:
            pytest.skip("No migration available for next major version")

        # run migration
        runner = CliRunner()
        result = runner.invoke(
            cli.cli, ["migrate", str(v07_db), "--from", "v0.7", "--yes"]
        )

        assert result.exit_code == 0
        assert "Upgrade path found" in result.output

        driver_updated = get_driver(str(v07_db), provider="sqlite")

        # key_names did not exist in v0.7
        assert driver_updated.key_names == ("key1", "akey", "key2")
