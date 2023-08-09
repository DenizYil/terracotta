def test_metadata_handler(use_testdb):
    from terracotta.handlers import metadata, datasets

    ds = datasets.datasets()[0]
    md = metadata.metadata(ds)
    assert md
    assert md["metadata"] == ["extra_data"]


def test_multiple_metadata_handler(use_testdb):
    from terracotta.handlers import metadata, datasets

    ds = datasets.datasets()
    ds1, ds2 = ds[0], ds[1]

    md = metadata.multiple_metadata(None, [ds1.values()])
    assert md
    assert md[0]["metadata"] == ["extra_data"]
    assert all(list(key in md[0] for key in ("keys", "metadata", "range", "percentiles", "bounds", "convex_hull")))

    md = metadata.multiple_metadata(None, [ds1.values(), ds2.values()])
    assert md
    assert len(md) == 2

    md = metadata.multiple_metadata(["bounds", "metadata", "bounds_south"], [ds1.values(), ds2.values()])
    assert md
    assert len(md[0].keys()) == 4
    assert all(list(key in md[0] for key in ("bounds", "metadata", "bounds_south", "keys")))

    md = metadata.multiple_metadata(None, [])
    assert len(md) == len(ds)
